'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Clock, Users, CheckCircle } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const clases = [
  {
    id: 1,
    titulo: "Introducción a React",
    descripcion: "Aprende los fundamentos de React y cómo crear componentes reutilizables.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "1h 30min",
    estudiantes: 120,
    nivel: "Principiante"
  },
  {
    id: 2,
    titulo: "Estado y Props en React",
    descripcion: "Domina el manejo de estado y props para crear aplicaciones dinámicas.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "2h",
    estudiantes: 98,
    nivel: "Intermedio"
  },
  {
    id: 3,
    titulo: "Hooks en React",
    descripcion: "Explora los hooks de React y cómo pueden simplificar tu código.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "1h 45min",
    estudiantes: 85,
    nivel: "Intermedio"
  },
  {
    id: 4,
    titulo: "Enrutamiento con React Router",
    descripcion: "Aprende a crear aplicaciones de una sola página con React Router.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "2h 15min",
    estudiantes: 72,
    nivel: "Avanzado"
  },
  {
    id: 5,
    titulo: "Gestión de Estado Global",
    descripcion: "Implementa soluciones de gestión de estado global como Redux o Context API.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "2h 30min",
    estudiantes: 63,
    nivel: "Avanzado"
  },
  {
    id: 6,
    titulo: "Optimización de Rendimiento",
    descripcion: "Técnicas para optimizar el rendimiento de tus aplicaciones React.",
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "2h",
    estudiantes: 55,
    nivel: "Avanzado"
  }
]

// Datos de ejemplo para los instructores
const instructores = [
  {
    nombre: "Ana García",
    rol: "Desarrolladora Senior de React",
    imagen: "/placeholder.svg?height=100&width=100"
  },
  {
    nombre: "Carlos Rodríguez",
    rol: "Arquitecto de Software",
    imagen: "/placeholder.svg?height=100&width=100"
  }
]

// Lo que aprenderás
const aprendizajes = [
  "Dominar los fundamentos de React y su ecosistema",
  "Crear componentes reutilizables y escalables",
  "Manejar el estado de la aplicación de manera eficiente",
  "Implementar enrutamiento para aplicaciones de una sola página",
  "Optimizar el rendimiento de aplicaciones React"
]

export function CursoClasesComponent() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId

  const handleClassClick = (classId: number) => {
    router.push(`/courses/${courseId}/classes/${classId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Desarrollo Avanzado con React</h1>
      
      {/* Sección de instructores */}
      <div className="bg-card text-card-foreground rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tus instructores</h2>
        <div className="flex flex-wrap gap-4">
          {instructores.map((instructor, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={instructor.imagen} alt={instructor.nombre} />
                <AvatarFallback>{instructor.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{instructor.nombre}</p>
                <p className="text-sm text-muted-foreground">{instructor.rol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de lo que aprenderás */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lo que aprenderás</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {aprendizajes.map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lista de clases */}
      <h2 className="text-2xl font-semibold mb-4">Clases del curso</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clases.map((clase) => (
          <Card 
            key={clase.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleClassClick(clase.id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClassClick(clase.id)
              }
            }}
          >
            <img
              src={clase.imagen}
              alt={`Imagen de la clase: ${clase.titulo}`}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle>{clase.titulo}</CardTitle>
              <CardDescription>{clase.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{clase.nivel}</Badge>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {clase.duracion}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {clase.estudiantes} estudiantes
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}