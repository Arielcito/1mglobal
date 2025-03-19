'use client'

import { useAuth } from "@/context/AuthContext"
import { redirect } from "next/navigation"
import { useState } from "react"
import api from '@/app/libs/axios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Video, PlusCircle, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useQuery, useQueryClient } from 'react-query'
import type { Course } from '@prisma/client'
import type { ClassStatus } from "@prisma/client"
import { CreateCourseModal } from '@/components/CreateCourseModal'
import { useUploadThing } from "@/lib/uploadthing";
import { Toaster } from "@/components/ui/toaster"
import type { AxiosError } from 'axios'

interface UploadClassForm {
  title: string
  description: string
  content?: string
  duration?: number
  order: number
  courseId: number
  status: ClassStatus
  scheduledAt?: Date
  isLive: boolean
  recordingUrl?: string
  videoType: 'upload' | 'youtube'
}

interface CreateCourseData {
  title: string
  description: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category_id?: number | null
  thumbnail_url?: string
  is_published?: boolean
}

export default function UploadClassPage() {
  const { user, isLoading: isLoadingAuth } = useAuth()
  
  if (!isLoadingAuth && !user) {
    redirect('/auth/signin')
  }

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<UploadClassForm>({
    title: '',
    description: '',
    content: '',
    duration: undefined,
    order: 1,
    courseId: 0,
    status: 'DRAFT',
    isLive: false,
    recordingUrl: '',
    videoType: 'upload'
  })
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false)
  
  const { startUpload, isUploading: isUploadingVideo } = useUploadThing("videoUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        toast({
          title: "Video subido",
          description: "El video se ha subido correctamente"
        });
      }
    },
    onUploadError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al subir el video"
      });
    },
  });

  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await api.get('/api/courses')
      return data
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let recordingUrl = formData.recordingUrl;

      if (formData.videoType === 'upload') {
        if (!videoFile) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se ha seleccionado ningún video"
          });
          return;
        }

        // Subir el video usando UploadThing
        const uploadResult = await startUpload([videoFile]);
        
        if (!uploadResult?.[0]) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Error al subir el video"
          });
          return;
        }

        recordingUrl = uploadResult[0].url;
      } else {
        // Validar URL de YouTube
        if (!formData.recordingUrl) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Debes proporcionar una URL de video válida"
          });
          return;
        }
      }

      // Crear la clase con la URL del video
      const { data } = await api.post("/api/classes", {
        ...formData,
        duration: formData.duration ? Number.parseInt(formData.duration.toString(), 10) : null,
        recordingUrl,
      });

      toast({
        title: "¡Éxito!",
        description: "La clase se ha creado correctamente"
      });

      // Limpiar el formulario después de una subida exitosa
      setVideoFile(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        duration: undefined,
        order: 1,
        courseId: 0,
        status: 'DRAFT',
        isLive: false,
        recordingUrl: '',
        videoType: 'upload'
      });

    } catch (error) {
      console.error("Error al subir la clase:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error",
        description: axiosError.response?.data?.message || "Error al crear la clase"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateCourse = async (courseData: CreateCourseData) => {
    try {
      const { data } = await api.post('/api/courses', courseData);
      
      // Invalidate and refetch courses query
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      toast({
        title: "¡Éxito!",
        description: "El curso se ha creado correctamente"
      });

      setIsCreateCourseModalOpen(false);
      
      // Set the newly created course as selected
      setFormData(prev => ({ 
        ...prev, 
        courseId: data.course_id 
      }));
    } catch (error) {
      console.error('Error al crear el curso:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Error",
        description: axiosError.response?.data?.message || "Error al crear el curso"
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Subir Nueva Clase</CardTitle>
          <CardDescription>
            Sube una nueva clase grabada para tus estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Curso */}
            <div className="space-y-2">
              <Label htmlFor="courseId">Curso</Label>
              <Select
                value={formData.courseId.toString()}
                onValueChange={(value) => {
                  if (value === 'new') {
                    setIsCreateCourseModalOpen(true)
                    return
                  }
                  setFormData(prev => ({ ...prev, courseId: Number(value) }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCourses ? "Cargando cursos..." : "Selecciona un curso"} />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem 
                      key={course.course_id}
                      value={course.course_id.toString()}
                    >
                      {course.title}
                    </SelectItem>
                  ))}
                  <SelectItem 
                    value="new" 
                    className="text-primary cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Crear nuevo curso</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Upload/URL Tabs */}
            <div className="space-y-2">
              <Label>Video de la Clase</Label>
              <Tabs 
                defaultValue="upload" 
                value={formData.videoType}
                onValueChange={(value: string) => 
                  setFormData(prev => ({ ...prev, videoType: value as 'upload' | 'youtube' }))
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Subir Video
                  </TabsTrigger>
                  <TabsTrigger value="youtube" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    URL de Video
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                    {videoFile ? (
                      <div className="space-y-2">
                        <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm">{videoFile.name}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setVideoFile(null)}
                        >
                          Cambiar video
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-2 flex flex-col items-center">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Arrastra un video o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setVideoFile(file)
                          }}
                        />
                        <Button type="button" variant="secondary">
                          Seleccionar Video
                        </Button>
                      </label>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="youtube">
                  <div className="space-y-4">
                    <Input
                      placeholder="Ingresa la URL del video (YouTube, Vimeo, etc.)"
                      value={formData.recordingUrl}
                      onChange={(e) => 
                        setFormData(prev => ({ ...prev, recordingUrl: e.target.value }))
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Asegúrate de que la URL sea pública y accesible para tus estudiantes
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Título de la Clase */}
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Clase</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Introducción al Análisis Técnico"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el contenido de la clase..."
                rows={4}
                required
              />
            </div>

            {/* Contenido Detallado */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenido Detallado</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Contenido detallado de la clase..."
                rows={6}
              />
            </div>

            {/* Duración y Orden */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number.parseInt(e.target.value) : undefined;
                    setFormData(prev => ({
                      ...prev,
                      duration: value
                    }));
                  }}
                  placeholder="60"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Orden en el curso</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Estado y Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ClassStatus) => 
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
                <Label htmlFor="isLive">Tipo de Clase</Label>
                <Select
                  value={formData.isLive.toString()}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, isLive: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Grabada</SelectItem>
                    <SelectItem value="true">En vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha Programada (solo si es en vivo) */}
            {formData.isLive && (
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Fecha y Hora Programada</Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  onChange={(e) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      scheduledAt: new Date(e.target.value) 
                    }))
                  }
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={
                isUploading || 
                isUploadingVideo || 
                (formData.videoType === 'upload' ? !videoFile : !formData.recordingUrl) || 
                !formData.courseId
              }
            >
              {isUploading || isUploadingVideo ? 'Subiendo...' : 'Subir Clase'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />
      <Toaster />
    </div>
  )
} 