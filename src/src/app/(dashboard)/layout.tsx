'use client'

import '../../css/animate.css'
import '../../css/style.css'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from '@/components/Dashboard/Sidebar'
import { DashboardHeader } from '@/components/Dashboard/Header'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useAuth } from '@/context/AuthContext'

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
  const [isTransitioning, setIsTransitioning] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Mostrar spinner mientras se carga o está en transición
  if (isLoading || isTransitioning) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // Si no hay usuario después de cargar, mostrar error
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="text-white text-xl">Sesión no válida</div>
      </div>
    );
  }

  // Usuario autenticado, mostrar dashboard
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
