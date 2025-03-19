'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import api from '@/app/libs/axios'

interface Stream {
  id: string
  title: string
  isLive: boolean
  userId: string
  ingressId: string
  thumbnailUrl: string | null
  user: {
    name: string
    image: string
  }
}

const StreamSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="aspect-video w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
  </div>
)

export const StreamGrid = () => {
  const router = useRouter()
  
  const { data: streams, isLoading } = useQuery<Stream[]>({
    queryKey: ['active-streams'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/stream/live');
        console.log('🔄 Streams cargados:', data);
        return data;
      } catch (error) {
        console.error('Error al cargar streams:', error);
        throw error;
      }
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    retry: 1
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={`stream-skeleton-${crypto.randomUUID()}`} className="p-4">
            <StreamSkeleton />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {streams?.map((stream) => (
        <Card 
          key={stream.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/stream/${stream.id}`)}
        >
          <CardHeader className="space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={stream.user.image} alt={stream.user.name} />
                <AvatarFallback>{stream.user.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm font-medium">
                {stream.user.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg relative mb-2">
              {stream.thumbnailUrl ? (
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">Sin miniatura</span>
                </div>
              )}
              <div className="absolute top-2 left-2">
                {stream.isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    EN VIVO
                  </Badge>
                )}
              </div>
            </div>
            <h3 className="font-semibold truncate">{stream.title}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 