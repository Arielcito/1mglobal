import { AuthProvider } from '@/context/AuthContext'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Providers from './providers'

export const metadata: Metadata = {
  title: 'One Movement Global',
  description: 'One Movement Global',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Analytics />
          <SpeedInsights />
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
} 