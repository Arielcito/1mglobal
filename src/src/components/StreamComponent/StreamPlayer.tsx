'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LiveKitRoom,
  VideoConference,
  Chat,
  RoomAudioRenderer,
  ControlBar,
  LayoutContextProvider,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { ChatComponent } from "./ChatComponent"
import VideoComponent from "./VideoComponent"

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
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  const handleToggleInfo = () => {
    setShowInfo(!showInfo)
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
      >
        <div className="h-screen w-full relative flex flex-col">
          {/* Mobile Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>

          {/* Info Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 lg:hidden"
            onClick={handleToggleInfo}
          >
            {showInfo ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Info className="h-6 w-6 text-white" />
            )}
          </Button>

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-4 gap-2 p-2">
            <div className="lg:col-span-3 flex flex-col gap-2">
              {/* Video Container */}
              <Card className="aspect-video w-full relative">
                <VideoComponent isHost={isHost} />
              </Card>

              {/* Stream Info - Mobile */}
              <div className={cn(
                "fixed inset-x-0 top-[56.25vw] bottom-0 bg-background/95 backdrop-blur-sm z-40 transition-transform duration-300 lg:hidden overflow-y-auto",
                showInfo ? "translate-y-0" : "translate-y-full"
              )}>
                <Card className="rounded-t-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary">
                        <AvatarImage src={hostImage} alt={hostName} />
                        <AvatarFallback>{hostName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <div className="flex items-center gap-2 my-2">
                          <Badge variant="destructive" className="animate-pulse">
                            EN VIVO
                          </Badge>
                          <p className="text-sm text-muted-foreground">{hostName}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stream Info - Desktop */}
              <Card className="hidden lg:block">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary">
                        <AvatarImage src={hostImage} alt={hostName} />
                        <AvatarFallback>{hostName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <div className="flex items-center gap-2 my-2">
                          <Badge variant="destructive" className="animate-pulse">
                            EN VIVO
                          </Badge>
                          <p className="text-sm text-muted-foreground">{hostName}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
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
