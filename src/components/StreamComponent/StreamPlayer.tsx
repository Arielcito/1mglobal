'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  LiveKitRoom,
  LayoutContextProvider,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { ChatComponent } from "./ChatComponent"
import VideoComponent from "./VideoComponent"
import { toast } from "react-hot-toast"
import Image from "next/image"
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
          <div className="absolute inset-0 flex items-center justify-center bg-background">
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
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  const handleToggleInfo = () => {
    setShowInfo(!showInfo)
  }

  if (!token || !process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    return <StreamSkeleton />
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
        onConnected={() => setIsConnecting(false)}
        onError={(error) => {
          console.error('Error en LiveKitRoom:', error)
          toast.error('Error al conectar con el servidor de streaming.')
        }}
        options={{
          adaptiveStream: true,
          dynacast: true,
          stopLocalTrackOnUnpublish: true,
          disconnectOnPageLeave: true
        }}
      >
        <div className="h-screen w-full relative flex flex-col">
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
              <Card className="aspect-video relative overflow-hidden rounded-none lg:rounded-md">
                {isConnecting ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                    <Image src={"/images/logo/logo-white.png"} alt="Logo" width={173} height={34} />
                    <p className="text-white">Conectando al stream...</p>
                  </div>
                ) : (
                  <VideoComponent isHost={isHost} />
                )}
              </Card>

              {/* Stream Info */}
              <Card className="">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={hostImage} />
                      <AvatarFallback>{hostName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{title}</h2>
                      <p className="text-sm text-muted-foreground">{hostName}</p>
                      <p className="text-sm text-muted-foreground">
                        {viewerCount} espectadores
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleInfo}
                    >
                      {showInfo ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Info className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {showInfo && (
                    <p className="text-sm mt-4">{description}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Column */}
            <Card className="flex-1 lg:h-screen">
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
