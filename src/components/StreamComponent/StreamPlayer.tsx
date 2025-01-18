'use client'

import { useState, useCallback, useEffect } from "react"
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
  DisconnectReason,
  Participant
} from 'livekit-client'
import { VideoPresets, ConnectionQuality } from 'livekit-client'
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
  const [hasPermissions, setHasPermissions] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log('🎯 Iniciando StreamPlayer con:', {
      streamId,
      isHost,
      token: token ? 'presente' : 'ausente',
      wsUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL
    })

    // Solo solicitar permisos si es host
    if (isHost) {
      const requestPermissions = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          })
          setHasPermissions(true)
          // Liberar los tracks después de obtener permisos
          for (const track of stream.getTracks()) {
            track.stop()
          }
        } catch (error) {
          console.error('Error al solicitar permisos:', error)
          setHasPermissions(false)
          toast.error('No se pudo acceder a la cámara/micrófono. Por favor, verifica los permisos.')
        }
      }
      requestPermissions()
    }

    // Inicializar AudioContext después de una interacción del usuario
    const handleUserInteraction = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)
        // Remover los event listeners después de la primera interacción
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      // Limpiar AudioContext al desmontar
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [streamId, isHost, token, audioContext])

  const handleBackClick = () => {
    router.back()
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
    console.log('🟢 Conectado al stream')
    setIsConnecting(false)
    setIsConnected(true)
    toast.success('¡Conectado al stream!')
  }, [])

  const handleDisconnected = useCallback((reason?: DisconnectReason) => {
    console.log('🔴 Desconectado del stream:', reason)
    setIsConnected(false)
    toast.error(`Desconectado del stream: ${reason || 'razón desconocida'}`)
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('❌ Error en LiveKitRoom:', error)
    if (error.name === 'NotAllowedError') {
      toast.error('No se pudo acceder a la cámara/micrófono. Por favor, verifica los permisos.')
      setHasPermissions(false)
    } else {
      toast.error(`Error al conectar con el servidor de streaming: ${error.message}`)
    }
  }, [])

  if (!token || !process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    console.error('❌ Falta token o URL de LiveKit')
    return <StreamSkeleton />
  }

  // Si es host y no tiene permisos, mostrar mensaje
  if (isHost && !hasPermissions) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-white mb-4">Se requieren permisos</h2>
          <p className="text-zinc-300 mb-4">Para iniciar el stream, necesitamos acceso a tu cámara y micrófono.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  const roomOptions: RoomOptions & RoomConnectOptions = {
    adaptiveStream: true,
    dynacast: true,
    stopLocalTrackOnUnpublish: true,
    disconnectOnPageLeave: false,
    publishDefaults: {
      simulcast: true,
      videoSimulcastLayers: [
        VideoPresets.h720,
        VideoPresets.h360
      ]
    },
    videoCaptureDefaults: {
      resolution: VideoPresets.h720
    },
    audioCaptureDefaults: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }

  return (
    <LayoutContextProvider>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        video={isHost}
        audio={isHost}
        className="h-full"
        onConnected={handleConnected}
        onDisconnected={handleDisconnected}
        onError={handleError}
        options={roomOptions}
      >
        <RoomAudioRenderer />
        <div className="h-screen w-full relative flex flex-col bg-zinc-900">
          {/* Mobile Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50 lg:hidden"
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
                  <VideoComponent isHost={isHost} />
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
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <p>{currentViewers} espectadores</p>
                        </div>
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
