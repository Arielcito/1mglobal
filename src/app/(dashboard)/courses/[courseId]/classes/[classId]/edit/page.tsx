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

interface Class {
  class_id: number
  course_id: number
  title: string
  description: string
  scheduled_at: string | null
  is_live: boolean
  recording_url: string | null
  content: string | null
  duration: number
  order: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  created_at: string
  updated_at: string
  published_at: string | null
}

interface ApiError {
  message: string
  status: number
}

export default function EditClassPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const courseId = params.courseId as string
  const classId = params.classId as string
  const [formData, setFormData] = useState<Partial<Class>>({})
  const [isLoading, setIsLoading] = useState(false)

  const { data: classData, error: classError } = useQuery<Class, AxiosError<ApiError>>({
    queryKey: ['class', classId],
    queryFn: async () => {
      const { data } = await api.get(`/api/classes/${classId}`)
      return data
    }
  })

  useEffect(() => {
    if (classData) {
      setFormData(classData)
    }
  }, [classData])

  useEffect(() => {
    if (classError) {
      const errorMessage = classError.response?.data?.message || "No se pudo cargar la clase"
      const errorTitle = classError.response?.status === 401 
        ? "No autorizado" 
        : classError.response?.status === 403 
          ? "Acceso denegado" 
          : classError.response?.status === 404 
            ? "Clase no encontrada" 
            : "Error"

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorMessage
      })
    }
  }, [classError, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.put(`/api/classes/${classId}`, formData)

      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ['classes'] })
        await queryClient.invalidateQueries({ queryKey: ['class', classId] })
        
        toast({
          title: "¡Éxito!",
          description: "Los cambios han sido guardados exitosamente",
          variant: "default"
        })
        router.push(`/courses/${courseId}/classes`)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage = axiosError.response?.data?.message || "No se pudieron guardar los cambios"
      const errorTitle = axiosError.response?.status === 401 
        ? "No autorizado" 
        : axiosError.response?.status === 403 
          ? "Acceso denegado" 
          : axiosError.response?.status === 404 
            ? "Clase no encontrada" 
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

  const handleDateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      scheduled_at: value
    }))
  }

  if (!classData) {
    if (classError) {
      return (
        <div className="container mx-auto py-10">
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-destructive text-2xl">⚠️</div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-destructive">
                  {classError.response?.status === 401 
                    ? "No autorizado" 
                    : classError.response?.status === 403 
                      ? "Acceso denegado" 
                      : classError.response?.status === 404 
                        ? "Clase no encontrada" 
                        : "Error al cargar la clase"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {classError.response?.data?.message || "No se pudo cargar la clase"}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/courses/${courseId}/classes`)}
                className="mt-4"
              >
                Volver a clases
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
          <CardTitle>Editar Clase</CardTitle>
          <CardDescription>Modifica los detalles de la clase</CardDescription>
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
                placeholder="Título de la clase"
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
                placeholder="Descripción de la clase"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Fecha programada</Label>
                <Input
                  id="scheduled_at"
                  name="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at?.slice(0, 16) || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration || ''}
                  onChange={handleInputChange}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Orden</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Class['status']) => 
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="recording_url">URL de la grabación</Label>
              <Input
                id="recording_url"
                name="recording_url"
                value={formData.recording_url || ''}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/grabacion.mp4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido adicional</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ''}
                onChange={handleInputChange}
                placeholder="Contenido o recursos adicionales para la clase"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/courses/${courseId}/classes`)}
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