import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real implementation, you would fetch notifications from the database
    // For now, we'll return some mock data
    const mockNotifications = [
      {
        id: '1',
        title: 'Nueva señal de trading disponible',
        message: 'Se ha generado una nueva señal de compra para BTC/USDT. Revisa los detalles en la plataforma.',
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'Cierre de posición recomendado',
        message: 'Se recomienda cerrar la posición abierta en ETH/USDT con una ganancia estimada del 2.5%.',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true
      },
      {
        id: '3',
        title: 'Actualización de estrategia',
        message: 'La estrategia de trading ha sido actualizada. Se enfocará en operaciones de menor duración en el mercado actual.',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        read: true
      }
    ]

    return NextResponse.json(mockNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 