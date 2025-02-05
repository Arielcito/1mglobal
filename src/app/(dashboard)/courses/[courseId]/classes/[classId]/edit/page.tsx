'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from 'react-query'
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

interface Class {
  classId: number
  courseId: number
  title: string
  description: string
  scheduledAt: string | null
  isLive: boolean
  recordingUrl: string | null
  content: string | null
  createdAt: string
  duration: number
  order: number
  publishedAt: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  updatedAt: string
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

  const { data: classData } = useQuery<Class>({
    queryKey: ['class', classId],
    queryFn: async () => {
      const { data } = await api.get(`/api/classes/${classId}`)
      const formattedData = {
        ...data,
        classId: data.class_id || data.classId,
        courseId: data.course_id || data.courseId,
        scheduledAt: data.scheduled_at || data.scheduledAt,
        isLive: data.is_live || data.isLive,
        recordingUrl: data.recording_url || data.recordingUrl,
        publishedAt: data.published_at || data.publishedAt,
        updatedAt: data.updated_at || data.updatedAt,
        createdAt: data.created_at || data.createdAt,
      }
      return formattedData
    },
    onSuccess: (data) => {
      setFormData(data)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.put(`/api/classes/${classId}`, formData)
      await queryClient.invalidateQueries(['classes'])
      await queryClient.invalidateQueries(['class', classId])
      
      toast({
        title: "Clase actualizada",
        description: "Los cambios han sido guardados exitosamente"
      })
      router.back()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudieron guardar los cambios. Por favor, intenta nuevamente."
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
      scheduledAt: value
    }))
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
                <Label htmlFor="scheduledAt">Fecha programada</Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt?.slice(0, 16) || ''}
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
              <Label htmlFor="recordingUrl">URL de la grabación</Label>
              <Input
                id="recordingUrl"
                name="recordingUrl"
                value={formData.recordingUrl || ''}
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