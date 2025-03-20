'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import api from '@/app/libs/axios'
import { useToast } from '@/hooks/use-toast'
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
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, MoreVertical, Trash2, Video, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Class {
  classId: number;
  course_id: number;
  title: string;
  description: string;
  scheduled_at: string | null;
  is_live: boolean;
  recording_url: string | null;
  content: string | null;
  created_at: string;
  duration: number;
  order: number;
  published_at: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  updated_at: string;
}

interface Course {
  course_id: number;
  title: string;
  description: string;
  classes: Class[];
}

const getStatusBadge = (status: Class['status']) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-red-100 text-red-800'
  }
  return colors[status]
}

// Función para obtener el curso con sus clases
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
    
    console.log('🎓 Curso:', course)
    console.log('📚 Clases:', sortedClasses)
    
    return { 
      ...course, 
      classes: sortedClasses 
    }
  } catch (error) {
    console.error('❌ Error al cargar el curso y sus clases:', error)
    throw new Error('Error al cargar el curso y sus clases')
  }
}

export default function CourseClassesPage() {
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
    queryFn: () => fetchCourseWithClasses(courseId),
    enabled: !!courseId
  })

  const handleDelete = async (classId: number) => {
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

  const handleCreateClass = () => {
    router.push(`/courses/${courseId}/classes/create`)
  }

  const handleBack = () => {
    router.push('/courses')
  }

  if (error) {
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
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="hover:bg-zinc-100"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <CardTitle>{course?.title}</CardTitle>
                <CardDescription>Gestiona las clases de este curso</CardDescription>
              </div>
            </div>
            <Button onClick={handleCreateClass}>
              Crear Clase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course?.classes?.map((classItem) => {
                  console.log('📝 Class Item:', classItem)
                  return (
                    <TableRow key={classItem.classId}>
                      <TableCell>{classItem.order}</TableCell>
                      <TableCell className="font-medium">{classItem.title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(classItem.status)}>
                          {classItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{classItem.duration ? `${classItem.duration} min` : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={classItem.is_live ? "default" : "secondary"}>
                          {classItem.is_live ? "En vivo" : "Grabada"}
                        </Badge>
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
                            {classItem.is_live ? (
                              <DropdownMenuItem
                                onClick={() => router.push(`/stream/${classItem.classId}`)}
                                className="cursor-pointer"
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Ir al stream
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => router.push('/upload')}
                                className="cursor-pointer"
                              >
                                <Video className="mr-2 h-4 w-4" />
                                Ver clase
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => router.push(`/courses/${courseId}/classes/${classItem.classId}/edit`)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(classItem.classId)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 