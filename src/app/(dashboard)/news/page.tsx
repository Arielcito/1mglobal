'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import api from '@/services/api'
import { Skeleton } from '@/components/ui/skeleton'

interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  duration: number
  createdAt: string
  courseId: string
  courseName: string
  instructor: {
    name: string
    image: string
  }
}

const NewsPage = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await api.get('/api/videos/latest')
        setVideos(data)
      } catch (error) {
        console.error('Error al cargar los videos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Últimas Novedades</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden bg-zinc-900/50 border-stroke-dark">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Últimas Novedades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link 
            key={video.id}
            href={`/courses/${video.courseId}/classes/${video.id}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="overflow-hidden bg-zinc-900/50 border-stroke-dark hover:border-primary/50 transition-colors">
              <div className="relative aspect-video">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-black/80 text-white px-2 py-1">
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')} min
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold text-white line-clamp-2">
                  {video.title}
                </h2>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-primary/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(video.createdAt), 'dd MMM yyyy', { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{video.instructor.name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stroke-dark">
                  <Badge variant="outline" className="text-primary border-primary/20">
                    {video.courseName}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NewsPage 