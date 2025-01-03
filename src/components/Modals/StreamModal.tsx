import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Video, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from '@/app/libs/axios'
interface StreamFormData {
  title: string;
  description: string;
}

interface IngressResponse {
  streamKey: string;
  serverUrl: string;
}

interface StreamModalProps {
  session: {
    id: string;
    name: string | null;
  };
}

const StreamModal = ({ session }: StreamModalProps) => {
  const [formData, setFormData] = React.useState<StreamFormData>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [ingressResponse, setIngressResponse] = React.useState<IngressResponse | null>(null);
  const [copied, setCopied] = React.useState({
    serverUrl: false,
    streamKey: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopy = async (text: string, type: 'serverUrl' | 'streamKey') => {
    await navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    toast.success(
      `${type === 'serverUrl' ? 'URL del servidor' : 'Clave de stream'} copiada`
    );
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/api/stream/create', {
        room_name: formData.title,
        metadata: {
          creator_identity: session.id,
          title: formData.title,
          description: formData.description,
          enable_chat: true,
          allow_participation: true,
        }
      });
      
      setIngressResponse({
        streamKey: data.token,
        serverUrl: data.ws_url,
      });

      await api.post('/api/stream/live', {
        name: formData.title,
        title: formData.title,
        description: formData.description,
        userId: session.id,
      });

      toast.success('Stream creado exitosamente');
    } catch (error) {
      console.error('Error al crear el stream:', error);
      toast.error("No se pudo crear el stream. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndStream = async () => {
    try {
      await api.delete('/stream/rooms');
      
      await api.post('/api/stream/live', {
        isLive: false,
        userId: session.id,
      });

      toast.success('Stream finalizado');
    } catch (error) {
      console.error('Error al finalizar el stream:', error);
      toast.error('Error al finalizar el stream');
    }
  };

  const handleCloseModal = async () => {
    if (ingressResponse) {
      await handleEndStream();
    }
    setIngressResponse(null);
    setFormData({ title: "", description: "" });
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="flex items-center space-x-2 bg-primary"
        >
          <Video className="h-5 w-5" />
          <span>Empezar Stream</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {ingressResponse ? 'Configuración del Stream' : 'Configurar Nuevo Stream'}
          </DialogTitle>
        </DialogHeader>
        
        {!ingressResponse ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Ingresa el título del stream"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descripción
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe el contenido del stream"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <DialogTrigger asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogTrigger>
              <Button type="submit" disabled={loading} className="bg-primary">
                {loading ? "Creando..." : "Iniciar Stream"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <label htmlFor="serverUrl" className="text-sm font-medium">
                Server URL
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="serverUrl"
                  value={ingressResponse.serverUrl}
                  readOnly
                  className="w-full font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(ingressResponse.serverUrl, 'serverUrl')}
                  aria-label="Copiar URL del servidor"
                >
                  {copied.serverUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="streamKey" className="text-sm font-medium">
                Stream Key
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="streamKey"
                  value={ingressResponse.streamKey}
                  type="password"
                  readOnly
                  className="w-full font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(ingressResponse.streamKey, 'streamKey')}
                  aria-label="Copiar clave de stream"
                >
                  {copied.streamKey ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copia estos valores en tu software de streaming (OBS, Streamlabs, etc.) 
                bajo Stream → Service → Custom.
              </p>
              <div className="flex justify-end">
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-primary">
                    Listo
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StreamModal;