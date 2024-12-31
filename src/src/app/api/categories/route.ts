import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al cargar las categorías' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()
    
    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    })
    
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500 }
    )
  }
} 