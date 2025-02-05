'use client'

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Info, X, Users, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  LiveKitRoom,
  LayoutContextProvider,
  useRoomContext,
  RoomAudioRenderer
} from '@livekit/components-react'
import type { 
  RoomOptions,
  RoomConnectOptions,
  Participant
} from 'livekit-client'
import { VideoPresets, ConnectionQuality, DisconnectReason } from 'livekit-client'
import '@livekit/components-styles'
import { ChatComponent } from "./ChatComponent"
import VideoComponent from "./VideoComponent"
import { toast } from "sonner"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StreamPlayerProps {
  streamId: string
  token: string
  hostName: string
  hostImage?: string
  title: string
  description?: string
  viewerCount: number
  isHost?: boolean
}

export const StreamSkeleton = () => (
  <div className="h-screen w-full relative lg:h-[calc(100vh-80px)] lg:static">
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-2 h-full">
      <div className="lg:col-span-3 flex flex-col gap-2">
        <Card className="aspect-video w-full">
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <Skeleton className="h-full w-full" />
          </div>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)

export const StreamPlayer = ({
  streamId,
  token,
  hostName,
  hostImage,
  title,
  description,
  viewerCount,
  isHost = false,
}: StreamPlayerProps) => {
  const [showInfo, setShowInfo] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [currentViewers, setCurrentViewers] = useState(viewerCount)
  const router = useRouter()
  const connectionAttempts = useRef(0)

  useEffect(() => {
    console.log('🔄 Componente StreamPlayer montado', {
      streamId,
      isHost,
      hasToken: !!token,
      hasServerUrl: !!process.env.NEXT_PUBLIC_LIVEKIT_URL,
      tokenLength: token?.length
    });

    return () => {
      console.log('🔄 Componente StreamPlayer desmontado', {
        streamId,
        isHost,
        connectionAttempts: connectionAttempts.current
      });
    };
  }, [streamId, isHost, token]);

  const handleBackClick = () => {
    router.push('/dashboard')
  }

  const handleToggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `¡Mira el stream de ${hostName}!`,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('¡Enlace copiado al portapapeles!')
      }
    } catch (error) {
      console.error('Error al compartir:', error)
      toast.error('No se pudo compartir el stream')
    }
  }, [title, hostName])

  const handleConnected = useCallback(() => {
    connectionAttempts.current += 1;
    console.log('✅ Conectado al stream:', {
      streamId,
      isHost,
      currentTime: new Date().toISOString(),
      attempt: connectionAttempts.current
    });
    setIsConnecting(false);
    setIsConnected(true);
    toast.success('¡Conectado al stream!');
  }, [streamId, isHost]);

  const handleDisconnected = useCallback((reason?: DisconnectReason) => {
    console.log('❌ Desconectado del stream:', {
      reason,
      reasonName: DisconnectReason[reason || 0],
      streamId,
      isHost,
      currentTime: new Date().toISOString(),
      attempts: connectionAttempts.current
    });
    setIsConnected(false);

    // Mensaje personalizado según la razón de desconexión
    let errorMessage = 'Desconectado del stream';
    switch (reason) {
      case DisconnectReason.DUPLICATE_IDENTITY:
        errorMessage = 'Ya existe una conexión activa con esta identidad';
        break;
      case DisconnectReason.CLIENT_INITIATED:
        errorMessage = 'Desconexión iniciada por el cliente';
        break;
      case DisconnectReason.SERVER_SHUTDOWN:
        errorMessage = 'El servidor se ha desconectado';
        break;
      case DisconnectReason.PARTICIPANT_REMOVED:
        errorMessage = 'Has sido removido de la transmisión';
        break;
      default:
        errorMessage = `Desconectado del stream: ${reason || 'razón desconocida'}`;
    }
    toast.error(errorMessage);
  }, [streamId, isHost]);

  const handleError = useCallback((error: Error) => {
    console.error('❌ Error en LiveKitRoom:', {
      error,
      message: error.message,
      streamId,
      isHost,
      currentTime: new Date().toISOString(),
      attempts: connectionAttempts.current
    });
    toast.error(`Error al conectar con el servidor de streaming: ${error.message}`);
  }, [streamId, isHost]);

  if (!token || !process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    console.error('❌ Falta token o URL de LiveKit', {
      hasToken: !!token,
      hasServerUrl: !!process.env.NEXT_PUBLIC_LIVEKIT_URL,
      tokenLength: token?.length
    });
    return <StreamSkeleton />;
  }

  const roomOptions: RoomOptions & RoomConnectOptions = {
    adaptiveStream: false,
    dynacast: false,
    stopLocalTrackOnUnpublish: false,
    disconnectOnPageLeave: false,
    autoSubscribe: true,
    publishDefaults: {
      simulcast: false,
      videoCodec: 'vp8',
    }
  };

  return (
    <LayoutContextProvider>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        video={false}
        audio={false}
        className="h-full"
        onConnected={handleConnected}
        onDisconnected={handleDisconnected}
        onError={handleError}
        options={roomOptions}
        data-host={isHost}
      >
        <RoomAudioRenderer />
        <div className="h-screen w-full relative flex flex-col bg-zinc-900">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50 hover:bg-zinc-800"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-2 h-full">
            {/* Video Column */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              {/* Video Player */}
              <Card className="aspect-video relative overflow-hidden rounded-none lg:rounded-md bg-zinc-800">
                {isConnecting ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                    <Image 
                      src={"/images/logo/logo-white.png"} 
                      alt="Logo" 
                      width={173} 
                      height={34}
                      priority
                      className="w-auto h-auto"
                    />
                    <p className="text-white mt-4">Conectando al stream...</p>
                  </div>
                ) : (
                  <VideoComponent isHost={false} />
                )}
                
                {/* Estado de conexión */}
                <div className="absolute top-4 right-4 z-50">
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "En vivo" : "Desconectado"}
                  </Badge>
                </div>
              </Card>

              {/* Stream Info */}
              <Card className="bg-zinc-800/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={hostImage} />
                      <AvatarFallback>{hostName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <p>{hostName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="hover:bg-zinc-700"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleInfo}
                        className="hover:bg-zinc-700"
                      >
                        {showInfo ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <Info className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className={cn(
                    "grid transition-all",
                    showInfo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}>
                    <div className="overflow-hidden">
                      <p className="text-sm mt-4 text-zinc-300">{description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Column */}
            <Card className="flex-1 lg:h-screen bg-zinc-800/50">
              <CardContent className="p-0 h-full">
                <ChatComponent />
              </CardContent>
            </Card>
          </div>
        </div>
      </LiveKitRoom>
    </LayoutContextProvider>
  )
}
