'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { StreamGrid } from '@/components/StreamComponent/StreamGrid'

export default function DashboardPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div className="space-y-4 md:space-y-6 px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Streams en vivo
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            Explora los streams disponibles
          </p>
        </div>
        <StreamGrid />
      </div>
    )
  }

  return null
}
