'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
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
import { Pencil, MoreVertical, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateCourseModal } from '@/components/CreateCourseModal'
import { CreateCourseInput } from '@/types/course'

interface Course {
  course_id: number
  title: string
  description: string
  instructor_id: string
  category_id?: number
  image_url?: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

const getLevelBadge = (level: Course['level']) => {
  const colors = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800'
  }
  return colors[level]
}

const getStatusBadge = (status: Course['status']) => {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-red-100 text-red-800'
  }
  return colors[status]
}

export default function CoursesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const { data: courses, isLoading, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await api.get('/api/courses')
      return data
    }
  })

  const handleDelete = async (courseId: number) => {
    try {
      await api.delete(`/api/courses/${courseId}`)
      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado exitosamente"
      })
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el curso"
      })
    }
  }

  const handleCreateCourse = async (courseData: CreateCourseInput) => {
    try {
      console.log("courseData", courseData)
      await api.post('/api/courses', courseData)
      toast({
        title: "Curso creado",
        description: "El curso ha sido creado exitosamente"
      })
      setIsCreateModalOpen(false)
      setTimeout(() => {
        refetch()
      }, 500)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el curso"
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Cursos</CardTitle>
              <CardDescription>Administra todos los cursos de la plataforma</CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Crear Curso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.map((course) => (
                  <TableRow key={course.course_id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <Badge className={getLevelBadge(course.level)}>
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(course.status)}>
                        {course.status}
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
                          <DropdownMenuItem
                            onClick={() => router.push(`/courses/${course.course_id}/classes`)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver clases
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/courses/${course.course_id}/edit`)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(course.course_id)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />
    </div>
  )
} 