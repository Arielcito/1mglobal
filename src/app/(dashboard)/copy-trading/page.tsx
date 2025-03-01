'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CopyTradingDisclaimer } from '@/components/CopyTrading/Disclaimer'
import { useQuery } from 'react-query'
import api from '@/app/libs/axios'
import { Bell } from 'lucide-react'
import { alertService } from '@/services/api'
import type { Alert } from '@/services/api'

export default function CopyTradingPage() {
  const { user } = useAuth()
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null)

  const { data: userTerms, isLoading: isLoadingTerms } = useQuery(
    ['user-terms'],
    async () => {
      const { data } = await api.get(`/api/users/${user?.id}`)
      return data
    },
    {
      enabled: !!user?.id,
      onSuccess: (data) => {
        setHasAcceptedTerms(data.termsAccepted || false)
      }
    }
  )

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery<Alert[]>(
    ['copy-trading-alerts'],
    async () => {
      return await alertService.getAlerts()
    },
    {
      enabled: !!user?.id && hasAcceptedTerms === true
    }
  )

  const handleDisclaimerAccepted = (accepted: boolean) => {
    setHasAcceptedTerms(accepted)
  }

  if (isLoadingTerms) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (hasAcceptedTerms === false) {
    return (
      <div className="container py-10">
        <CopyTradingDisclaimer onDisclaimerAccepted={handleDisclaimerAccepted} />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Bell className="mr-2 h-6 w-6" />
        Copy Trading Alertas
      </h1>

      <div className="space-y-4">
        {isLoadingAlerts ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="p-5 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                </h3>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full font-medium">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-3 text-gray-200 font-medium leading-relaxed border-l-2 border-primary/30 pl-3 py-1">
                {alert.message}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 shadow-inner">
            <Bell className="h-10 w-10 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 font-medium">No hay alertas disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
} 