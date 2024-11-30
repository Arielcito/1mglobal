'use client'

import '../../css/animate.css'
import '../../css/style.css'
import type * as React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from '@/components/Dashboard/Sidebar'
import { DashboardHeader } from '@/components/Dashboard/Header'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react'

interface LayoutProps {
  children: React.ReactNode
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
})
export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>
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
          </body>
        </html>
      </QueryClientProvider>
    </SessionProvider>
  )
}
