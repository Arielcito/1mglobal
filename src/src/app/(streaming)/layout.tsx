'use client'

import '../../css/animate.css'
import '../../css/style.css'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient } from "react-query"
import { QueryClientProvider } from "react-query"

export default function StreamingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en" className="h-screen">
          <body className="h-screen overflow-hidden">{children}</body>
        </html>
      </QueryClientProvider>
    </AuthProvider>
  )
} 