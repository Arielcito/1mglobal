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
import { Video, Copy, CheckCircle, ImageIcon, Eye, StopCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { streamService } from "@/services/streamService";
import type { StreamFormData } from "@/types/api";

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
    streamMethod: 'external',
    role: 'host'
  });
  const [ingressResponse, setIngressResponse] = React.useState<{ streamKey: string; serverUrl: string } | null>(null);
  const [copied, setCopied] = React.useState({
    serverUrl: false,
    streamKey: false,
  });

  const { startUpload, isUploading } = useUploadThing("thumbnailUploader");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: liveStreams, isLoading: isLoadingStreams } = useQuery({
    queryKey: ['liveStreams'],
    queryFn: streamService.getLiveStreams,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  console.log('Live Streams Data:', liveStreams);
  console.log('Session ID:', session.id);

  const activeStream = liveStreams?.find(stream => stream.userId === session.id && stream.isLive);
  console.log('Active Stream:', activeStream);
  console.log('Active Stream isLive:', activeStream?.isLive);
  console.log('Active Stream exists:', !!activeStream);
  console.log('Condition evaluation:', activeStream?.isLive === true);

  const stopStreamMutation = useMutation({
    mutationFn: streamService.stopStream,
    onSuccess: () => {
      toast.success('Stream terminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['liveStreams'] });
    },
    onError: () => {
      toast.error('Error al terminar el stream');
    },
  });

  const handleTerminateStream = async () => {
    if (!activeStream) return;
    stopStreamMutation.mutate();
  };

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

    try {
      if (formData.role === 'viewer') {
        const streamData = await streamService.getViewerToken(formData.title);
        router.push(`/stream/${formData.title}?token=${streamData.token}&isHost=false`);
        return;
      }

      if (formData.streamMethod === 'browser') {
        const data = await streamService.createBrowserStream({
          room_name: formData.title,
          metadata: {
            title: formData.title,
            description: formData.description,
            thumbnailUrl: formData.thumbnailUrl,
          }
        });

        router.push(`/stream/${data.stream.id}?token=${data.token}&isHost=true`);
      } else {
        const data = await streamService.createStream({
          room_name: formData.title,
          metadata: {
            title: formData.title,
            description: formData.description,
            thumbnailUrl: formData.thumbnailUrl,
          }
        });

        if (data.ingress) {
          setIngressResponse({
            streamKey: data.ingress.streamKey,
            serverUrl: data.ingress.url,
          });
        }
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      toast.error("No se pudo crear el stream. Intente nuevamente.");
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {activeStream?.isLive ? (
          <Button 
            onClick={handleTerminateStream} 
            disabled={stopStreamMutation.isPending} 
            className="bg-destructive hover:bg-destructive/90 flex items-center space-x-2"
          >
            <StopCircle className="h-5 w-5" />
            <span>{stopStreamMutation.isPending ? "Terminando..." : "Terminar Stream"}</span>
          </Button>
        ) : null}
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
          <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {activeStream?.isLive ? 'Stream Activo' : ingressResponse ? 'Configuración del Stream' : 'Configurar Nuevo Stream'}
              </DialogTitle>
            </DialogHeader>
            
            {activeStream?.isLive ? (
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2 text-yellow-500">
                  <StopCircle className="h-5 w-5" />
                  <span className="font-medium">Tienes un stream activo</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ¿Estás seguro de que deseas terminar el stream actual?
                </p>
                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </DialogTrigger>
                  <Button 
                    onClick={handleTerminateStream} 
                    disabled={stopStreamMutation.isPending} 
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {stopStreamMutation.isPending ? "Terminando..." : "Terminar Stream"}
                  </Button>
                </div>
              </div>
            ) : !ingressResponse ? (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="streamRole" className="text-sm font-medium">
                    Rol en el Stream
                  </Label>
                  <RadioGroup
                    id="streamRole"
                    value={formData.role}
                    onValueChange={(value: 'host' | 'viewer') => 
                      setFormData(prev => ({ ...prev, role: value }))
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="host" id="host" />
                      <Label htmlFor="host">
                        Crear Stream
                        <span className="block text-xs text-muted-foreground">
                          Transmite contenido como anfitrión
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="viewer" id="viewer" />
                      <Label htmlFor="viewer">
                        Ver Stream
                        <span className="block text-xs text-muted-foreground">
                          Únete como espectador
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    {formData.role === 'host' ? 'Título' : 'ID del Stream'}
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder={formData.role === 'host' ? "Ingresa el título del stream" : "Ingresa el ID del stream"}
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
                
                {formData.role === 'host' && (
                  <>
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
                      <Label htmlFor="thumbnailUpload" className="text-sm font-medium">
                        Miniatura del Stream
                      </Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="streamMethod" className="text-sm font-medium">
                        Método de Streaming
                      </Label>
                      <RadioGroup
                        id="streamMethod"
                        value={formData.streamMethod}
                        onValueChange={(value: 'browser' | 'external') => 
                          setFormData(prev => ({ ...prev, streamMethod: value }))
                        }
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="browser" id="browser" />
                          <Label htmlFor="browser">
                            Transmitir desde el navegador
                            <span className="block text-xs text-muted-foreground">
                              Usa tu cámara web y micrófono directamente
                            </span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="external" id="external" />
                          <Label htmlFor="external">
                            Usar software externo (OBS/Streamlabs)
                            <span className="block text-xs text-muted-foreground">
                              Más opciones de personalización
                            </span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      Cancelar
                    </Button>
                  </DialogTrigger>
                  <Button type="submit" disabled={stopStreamMutation.isPending} className="bg-primary">
                    {stopStreamMutation.isPending ? "Cargando..." : formData.role === 'host' ? "Iniciar Stream" : "Unirse al Stream"}
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
                      value={ingressResponse?.serverUrl ?? ''}
                      readOnly
                      className="w-full font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => ingressResponse && handleCopy(ingressResponse.serverUrl, 'serverUrl')}
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
                      value={ingressResponse?.streamKey ?? ''}
                      readOnly
                      className="w-full font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => ingressResponse && handleCopy(ingressResponse.streamKey, 'streamKey')}
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
      </div>
    </>
  );
};

export default StreamModal;