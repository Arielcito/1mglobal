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
import { Video, Copy, CheckCircle, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from '@/app/libs/axios'
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

interface StreamFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
}

interface StreamResponse {
  room_name: string;
  token: string;
  ws_url: string;
  ingress: {
    ingressId: string;
    url: string;
    streamKey: string;
  };
  stream: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    ingressId: string;
    serverUrl: string;
    streamKey: string;
    isLive: boolean;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    userId: string;
    createdAt: string;
    description: string;
    title: string;
  };
}

interface IngressResponse {
  streamKey: string;
  serverUrl: string;
}

interface StreamModalProps {
  session: {
    id: string;
    name: string | null;
    isAdmin?: boolean;
  };
}

const StreamModal = ({ session }: StreamModalProps) => {
  if (!session.isAdmin) return null;

  const [formData, setFormData] = React.useState<StreamFormData>({
    title: "",
    description: "",
    thumbnailUrl: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [ingressResponse, setIngressResponse] = React.useState<IngressResponse | null>(null);
  const [copied, setCopied] = React.useState({
    serverUrl: false,
    streamKey: false,
  });

  const { startUpload, isUploading } = useUploadThing("thumbnailUploader");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedFiles = await startUpload(Array.from(files));
      if (!uploadedFiles) return;

      const thumbnailUrl = uploadedFiles[0].url;
      setFormData(prev => ({
        ...prev,
        thumbnailUrl
      }));
      toast.success("Miniatura subida exitosamente");
    } catch (error) {
      console.error("Error al subir la miniatura:", error);
      toast.error("Error al subir la miniatura");
    }
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
      const { data } = await api.post<StreamResponse>('/api/stream/create', {
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
        streamKey: data.ingress.streamKey,
        serverUrl: data.ingress.url,
      });

      await api.post('/api/stream/live', {
        name: data.stream.name,
        title: data.stream.title,
        description: data.stream.description,
        thumbnailUrl: formData.thumbnailUrl,
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

  return (
    <Dialog onOpenChange={(open) => !open}>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Miniatura del Stream
              </label>
              <div className="flex flex-col gap-4">
                {formData.thumbnailUrl && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={formData.thumbnailUrl}
                      alt="Miniatura del stream"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="thumbnail" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isUploading ? "Subiendo..." : "Haz clic para subir una miniatura"}
                      </p>
                    </div>
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
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