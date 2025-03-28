'use client'

import { useState, useEffect } from 'react'
import api from '@/app/libs/axios'
import type { AxiosError } from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from "@/hooks/use-toast"
import type { CreateCourseInput } from '@/types/course'
import type { CourseLevel } from '@/types/course'
import { PlusCircle, Loader2 } from 'lucide-react'
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import imageCompression from 'browser-image-compression';

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreateCourse: (course: CreateCourseInput) => void
}

interface Category {
  id: number
  name: string
  description?: string
}

const generateImageName = (title: string, file: File): string => {
  const timestamp = Date.now();
  const extension = file.type.split('/')[1];
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${sanitizedTitle}-${timestamp}.${extension}`;
};

export const CreateCourseModal = ({ isOpen, onClose, onCreateCourse }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateCourseInput>({
    title: '',
    description: '',
    price: 0,
    level: 'BEGINNER',
    category_id: null,
    is_published: false,
    thumbnail_url: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories')
        setCategories(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las categorías"
        })
      }
    }

    fetchCategories()
  }, [toast])

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const { data } = await api.post('/api/categories', { 
        name: newCategory.trim() 
      })

      setCategories(prev => [...prev, data])
      setFormData(prev => ({ ...prev, category_id: data.id }))
      setNewCategory('')
      setShowNewCategoryInput(false)
      
      toast({
        title: "Éxito",
        description: "Categoría creada exitosamente"
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "No se pudo crear la categoría";

      if (axiosError.response?.status === 403) {
        errorMessage = "No tienes permisos para crear categorías. Contacta al administrador.";
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      })
    }
  }

  const handleCleanForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      level: 'BEGINNER',
      category_id: null,
      is_published: false,
      thumbnail_url: ''
    })
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("formData", formData)
    await onCreateCourse(formData)
  }

  const handleClose = () => {
    // test
    handleCleanForm()
    onClose()
  }

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Tamaño máximo de 1MB
      maxWidthOrHeight: 1920, // Dimensión máxima de 1920px
      useWebWorker: true,
      fileType: 'image/jpeg' // Convertir a JPEG para mejor compresión
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      return file; // Retorna el archivo original si falla la compresión
    }
  };

  const handleFileUploadComplete = async (res: { url: string }[]) => {
    setFormData(prev => ({ ...prev, thumbnail_url: res[0].url }));
    setIsUploadingImage(false)
    toast({
      title: "Éxito",
      description: "Imagen subida exitosamente"
    });
  };

  const handleFileUploadError = (error: Error) => {
    setIsUploadingImage(false)
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Error al subir la imagen"
    });
  };

  const preprocessFiles = async (files: File[]): Promise<File[]> => {
    return Promise.all(
      files.map(async (file) => {
        if (file.type.startsWith('image/')) {
          const compressedFile = await compressImage(file);
          // Crear un nuevo archivo con el nombre generado
          const newFileName = generateImageName(formData.title || 'curso', file);
          return new File([compressedFile], newFileName, {
            type: compressedFile.type
          });
        }
        return file;
      })
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
          <DialogTitle>Crear Nuevo Curso</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Nivel</Label>
            <Select
              value={formData.level}
              onValueChange={(value: typeof CourseLevel[keyof typeof CourseLevel]) => 
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

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            {!showNewCategoryInput ? (
              <Select
                value={formData.category_id?.toString() || ''}
                onValueChange={(value) => {
                  if (value === 'new') {
                    setShowNewCategoryInput(true)
                    return
                  }
                  setFormData(prev => ({ ...prev, category_id: Number(value) }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new" className="text-primary">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Crear nueva categoría</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nombre de la nueva categoría"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleCreateCategory}
                  disabled={!newCategory.trim()}
                >
                  Crear
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowNewCategoryInput(false)
                    setNewCategory('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagen de portada</Label>
            <div className="flex flex-col gap-4">
              {isUploadingImage ? (
                <div className="flex items-center justify-center h-[200px] border-2 border-dashed rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                  </div>
                </div>
              ) : formData.thumbnail_url ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                  >
                    Eliminar
                  </Button>
                </div>
              ) : (
                <UploadButton<OurFileRouter, 'thumbnailUploader'>
                  endpoint="thumbnailUploader"
                  onClientUploadComplete={handleFileUploadComplete}
                  onUploadError={handleFileUploadError}
                  onUploadBegin={() => setIsUploadingImage(true)}
                  appearance={{
                    button: "ut-ready:bg-primary ut-ready:text-white ut-ready:hover:bg-primary/90",
                    allowedContent: "text-gray-500 text-sm",
                    container: "w-full"
                  }}
                  content={{
                    button({ ready }) {
                      if (ready) return 'Seleccionar imagen';
                      return 'Cargando...';
                    },
                    allowedContent({ ready }) {
                      if (!ready) return '';
                      return 'Imágenes permitidas: PNG, JPG, JPEG hasta 4MB';
                    }
                  }}
                  config={{
                    mode: 'auto',
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isUploadingImage}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isUploadingImage || !formData.thumbnail_url}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Curso'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 