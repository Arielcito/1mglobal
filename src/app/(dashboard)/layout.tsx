'use client'

import '../../css/animate.css'
import '../../css/style.css'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from '@/components/Dashboard/Sidebar'
import { DashboardHeader } from '@/components/Dashboard/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 1000,
    },
  },
})

export default function DashboardLayout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user && !isRedirecting) {
      setIsRedirecting(true)
      router.push('/auth/signin')

      // Timeout para refrescar la página si la redirección toma más de 5 segundos
      const timeoutId = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [user, isLoading, router, isRedirecting])

  if (isLoading || isRedirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          <div className="text-white text-xl">
            {isRedirecting ? "Redirigiendo..." : "Cargando..."}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-gradient-to-b from-zinc-900 to-zinc-950">
          <DashboardSidebar />
          <div className="flex flex-col flex-grow">
            <DashboardHeader />
            <main className="flex-grow p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  )
}
