'use client'

import '../../css/animate.css'
import '../../css/style.css'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient } from "react-query"
import { QueryClientProvider } from "react-query"
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500">Algo salió mal</h2>
        <p className="mt-2 text-gray-300">{error.message}</p>
      </div>
    </div>
  )
}

export default function StreamingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5 // 5 minutos
      }
    }
  })

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="relative h-screen overflow-hidden bg-zinc-900 text-zinc-100">
            {children}
            <Toaster position="bottom-center" />
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
} 