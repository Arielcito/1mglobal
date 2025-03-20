'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/app/libs/axios'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { AxiosError } from 'axios'

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

interface ApiError {
  message: string
  status: number
}

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const courseId = params.courseId as string
  const [formData, setFormData] = useState<Partial<Course>>({})
  const [isLoading, setIsLoading] = useState(false)

  const { data: course, error: courseError } = useQuery<Course, AxiosError<ApiError>>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/api/courses/${courseId}`)
      return data
    }
  })

  useEffect(() => {
    if (course) {
      setFormData(course)
    }
  }, [course])

  useEffect(() => {
    if (courseError) {
      const errorMessage = courseError.response?.data?.message || "No se pudo cargar el curso"
      const errorTitle = courseError.response?.status === 401 
        ? "No autorizado" 
        : courseError.response?.status === 403 
          ? "Acceso denegado" 
          : courseError.response?.status === 404 
            ? "Curso no encontrado" 
            : "Error"

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage
      })
    }
  }, [courseError, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.put(`/api/courses/${courseId}`, formData)

      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['courses'] })
        await queryClient.invalidateQueries({ queryKey: ['course', courseId] })
        
        toast({
          title: "¡Éxito!",
          description: "Los cambios han sido guardados exitosamente",
          variant: "default"
        })
        router.push('/courses')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || "No se pudieron guardar los cambios"
      const errorTitle = axiosError.response?.status === 401 
        ? "No autorizado" 
        : axiosError.response?.status === 403 
          ? "Acceso denegado" 
          : axiosError.response?.status === 404 
            ? "Curso no encontrado" 
            : "Error"

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!course) {
    if (courseError) {
      return (
        <div className="container mx-auto py-10">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-destructive text-2xl">⚠️</div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-destructive">
                  {courseError.response?.status === 401 
                    ? "No autorizado" 
                    : courseError.response?.status === 403 
                      ? "Acceso denegado" 
                      : courseError.response?.status === 404 
                        ? "Curso no encontrado" 
                        : "Error al cargar el curso"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {courseError.response?.data?.message || "No se pudo cargar el curso"}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/courses')}
                className="mt-4"
              >
                Volver a cursos
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Editar Curso</CardTitle>
          <CardDescription>Modifica los detalles del curso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Título del curso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Descripción del curso"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="Precio del curso"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nivel</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: Course['level']) => 
                    setFormData(prev => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Principiante</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                    <SelectItem value="ADVANCED">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Course['status']) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de la imagen</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/courses')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 