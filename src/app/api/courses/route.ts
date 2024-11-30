import { NextResponse } from 'next/server'
import { CourseModel } from '@/models/course'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// Schema de validación actualizado para el curso
const courseSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  category_id: z.number().nullable(),
  thumbnail_url: z.string().url().optional(),
  is_published: z.boolean().default(false)
})

export async function POST(req: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener y validar datos
    const body = await req.json()
    const validatedData = courseSchema.parse(body)

    // Crear el curso usando el modelo
    const newCourse = await CourseModel.create({
      title: validatedData.title,
      description: validatedData.description,
      price: validatedData.price,
      level: validatedData.level,
      instructor: {
        connect: {
          id: session.user.id
        }
      },
      category: validatedData.category_id ? {
        connect: {
          id: validatedData.category_id
        }
      } : undefined,
      created_at: new Date(),
      updated_at: new Date(),
      image_url: validatedData.thumbnail_url || ''
    })

    return NextResponse.json(newCourse, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear curso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Obtener todos los cursos
export async function GET() {
  try {
    const courses = await CourseModel.getAll()
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error al obtener cursos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 