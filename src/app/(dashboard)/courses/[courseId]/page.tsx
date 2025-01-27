'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery } from 'react-query'
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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {course.title} - Clases
          </h1>
          <Button 
            onClick={() => router.push(`/courses/${courseId}/classes/new`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Clase
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Programada para</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay clases disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  course.classes
                    .sort((a, b) => a.order - b.order)
                    .map((clase) => (
                      <TableRow key={clase.classId}>
                        <TableCell>{clase.order}</TableCell>
                        <TableCell className="font-medium">{clase.title}</TableCell>
                        <TableCell>{clase.duration} min</TableCell>
                        <TableCell>
                          <Badge variant={
                            clase.isLive ? "destructive" : 
                            clase.status === 'PUBLISHED' ? "default" : 
                            "secondary"
                          }>
                            {clase.isLive ? 'EN VIVO' : clase.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {clase.scheduledAt ? 
                            new Date(clase.scheduledAt).toLocaleString() : 
                            'No programada'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => router.push(`/courses/${courseId}/classes/${clase.classId}`)}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver clase
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/courses/${courseId}/classes/${clase.classId}/edit`)}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClass(clase.classId)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CourseDetailPage