'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { CourseDetailSkeleton } from '@/components/Courses/CourseDetailSkeleton'
import api from '@/app/libs/axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Eye, Trash2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

// Interfaces
interface Instructor {
  id: string
  nombre: string
  rol: string
  imagen: string
}

interface Class {
  classId: number
  courseId: number
  title: string
  description: string
  scheduledAt: string | null
  isLive: boolean
  recordingUrl: string | null
  content: string | null
  duration: number
  order: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

interface Course {
  course_id: number
  title: string
  description: string
  imageUrl: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
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

    // Ordenamos las clases por orden
    const sortedClasses = classes.sort((a: Class, b: Class) => a.order - b.order)
    
    console.log('Curso:', course)
    console.log('Clases:', sortedClasses)
    
    return { 
      ...course, 
      classes: sortedClasses 
    }
  } catch (error) {
    console.error('Error al cargar el curso y sus clases:', error)
    throw new Error('Error al cargar el curso y sus clases')
  }
}

const getStatusBadge = (status: Class['status']) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-red-100 text-red-800'
  }
  return colors[status]
}

const CourseDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const courseId = params.courseId as string

  const { 
    data: course,
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseWithClasses(courseId)
  })

  const handleDeleteClass = async (classId: string) => {
    try {
      await api.delete(`/api/classes/${classId}`)
      toast({
        title: "Clase eliminada",
        description: "La clase ha sido eliminada exitosamente"
      })
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la clase"
      })
    }
  }

  const handleClassClick = (classId: number) => {
    if (!classId) {
      console.error('No se proporcionó el ID de la clase')
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo acceder a la clase"
      })
      return
    }
    
    console.log("Navegando a la clase:", {
      courseId,
      classId,
      url: `/courses/${courseId}/classes/${classId}`
    })
    
    router.push(`/courses/${courseId}/classes/${classId}`)
  }

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

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/3 aspect-video">
              {course.imageUrl && course.imageUrl.length > 0 ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', course.imageUrl);
                    console.error('Error event:', e);
                  }}
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-lg">{course.description}</CardDescription>
                </div>
                <Badge className="ml-2">{course.level}</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Badge variant="secondary">{course.classes?.length || 0} clases</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clases del Curso</CardTitle>
          <CardDescription>Lista de todas las clases disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Programada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.classes && course.classes.length > 0 ? (
                course.classes.map((classItem) => (
                  <TableRow 
                    key={classItem.classId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleClassClick(classItem.classId)}
                  >
                    <TableCell>{classItem.order}</TableCell>
                    <TableCell className="font-medium">
                      {classItem.title}
                      {classItem.isLive && (
                        <Badge variant="destructive" className="ml-2">EN VIVO</Badge>
                      )}
                    </TableCell>
                    <TableCell>{classItem.duration} min</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(classItem.status)}>
                        {classItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {classItem.scheduledAt ? 
                        new Date(classItem.scheduledAt).toLocaleString('es-ES', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }) : 
                        'No programada'
                      }
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hay clases disponibles para este curso
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseDetailPage