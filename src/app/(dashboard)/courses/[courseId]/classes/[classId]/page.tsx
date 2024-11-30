'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClass } from '@/hooks/useClass'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

const ClassPage = () => {
  const params = useParams()
  const router = useRouter()
  const { data: classes, isLoading, error } = useClass(params.courseId as string)
  
  const classId = Number(params.classId)
  const currentClass = classes?.find(clase => clase.class_id === classId)

  const handleBackClick = () => {
    router.back()
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error al cargar la clase</p>
      </div>
    )
  }

  if (isLoading || !currentClass) {
    return (
      <div className="h-screen w-full relative lg:h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-2 h-full">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative lg:h-[calc(100vh-80px)] lg:static ">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50"
        onClick={handleBackClick}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div className="flex flex-col h-full">
        {/* Video Section */}
        <div className="relative w-full aspect-video bg-slate-950">
          {currentClass.recording_url ? (
            <iframe
              title="Video de la clase"
              src={currentClass.recording_url}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-primary font-medium">No hay video disponible</p>
            </div>
          )}
        </div>

        {/* Class Info */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{currentClass.title}</h1>
            <Badge>{currentClass.status}</Badge>
          </div>
          
          {currentClass.duration && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{currentClass.duration} minutos</span>
            </div>
          )}

          <p className="text-muted-foreground">{currentClass.description}</p>
        </div>

        {/* Class List */}
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Siguientes clases</h2>
          <div className="space-y-2">
            {classes?.map((clase) => (
              <Link
                key={clase.class_id}
                href={`/courses/${params.courseId}/classes/${clase.class_id}`}
              >
                <Card
                  className={cn(
                    "p-4 cursor-pointer hover:bg-gray-100 transition-colors mb-4",
                    clase.class_id === classId && "bg-gray-100"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900">{clase.title}</h3>
                      {clase.duration && (
                        <Badge variant="outline" className="ml-2 text-gray-700">
                          {clase.duration} min
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {clase.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassPage