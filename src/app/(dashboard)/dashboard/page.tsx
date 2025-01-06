'use client'

import { useEffect } from 'react'
import { StreamGrid } from '@/components/StreamComponent/StreamGrid'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
    
  if (isLoading) {
    console.log('⌛ Mostrando estado de carga');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    console.log('❌ No hay usuario, retornando null');
    return null
  }

  console.log('✅ Renderizando dashboard para:', { id: user.id, email: user.email });
  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Bienvenido, {user.name || user.email}
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Explora los streams disponibles
        </p>
      </div>
      <StreamGrid />
    </div>
  )
}
