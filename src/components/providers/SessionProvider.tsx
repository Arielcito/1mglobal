'use client'

import { SessionProvider as Provider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query"

type Props = {
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

export function SessionProvider({ children }: Props) {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}
