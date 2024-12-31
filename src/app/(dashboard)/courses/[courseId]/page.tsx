'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge, Clock } from 'lucide-react'
import { useQuery } from 'react-query'
import { CourseDetailSkeleton } from '@/components/Courses/CourseDetailSkeleton'
import api from '@/app/libs/axios'

// Interfaces
interface Instructor {
  id: string
  nombre: string
  rol: string
  imagen: string
}

interface Class {
  classId: string
  title: string
  description: string
  duration: string
  status: string
  recordingUrl?: string
  isLive: boolean
  scheduledAt?: Date
  order: number
}

interface Course {
  course_id: number
  title: string
  description: string
  image_url: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: {
    name: string
  }
  instructors: Instructor[]
  classes: Class[]
}

// Funciones para fetch de datos
const fetchCourseWithClasses = async (courseId: string): Promise<Course> => {
  try {
    // Obtenemos el curso
    const courseResponse = await api.get(`/api/courses/${courseId}`)
    const course = courseResponse.data
    
    // Obtenemos las clases para este curso
    const classesResponse = await api.get(`/api/classes/course/${courseId}`)
    const classes = classesResponse.data
    
    return { ...course, classes }
  } catch (error) {
    console.error('Error al cargar el curso y sus clases:', error)
    throw new Error('Error al cargar el curso y sus clases')
  }
}

const CourseDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  const { 
    data: course,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseWithClasses(courseId)
  })

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-red-500">
            No se pudo cargar el curso
          </h2>
          <p className="text-muted-foreground mt-2">
            Por favor, intenta nuevamente más tarde
          </p>
        </div>
      </div>
    )
  }

  const handleClassClick = (classId: string) => {
    router.push(`/courses/${courseId}/classes/${classId}`)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {course.title}
        </h1>
        
        {/* Sección de descripción */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Descripción</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {course?.description}
            </div>
          </CardContent>
        </Card>

        {/* Lista de clases */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Contenido del curso
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {course.classes.map((clase) => (
              <Card 
                key={clase.classId}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleClassClick(clase.classId)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClassClick(clase.classId)
                  }
                }}
              >
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base sm:text-lg">
                        {clase.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clase.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{clase.duration}</span>
                    </div>
                    {clase.isLive && (
                      <Badge 
                        key={`badge-${clase.classId}`}
                        className="animate-pulse"
                      >
                        En vivo
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage