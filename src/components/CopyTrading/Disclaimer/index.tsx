'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/app/libs/axios'

interface DisclaimerProps {
  onDisclaimerAccepted: (accepted: boolean) => void
}

export const CopyTradingDisclaimer = ({ onDisclaimerAccepted }: DisclaimerProps) => {
  const [isAccepted, setIsAccepted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isAccepted && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await api.post('/api/users/terms-accepted', {
          termsAccepted: true
        })
        onDisclaimerAccepted(true)
      } catch (error) {
        console.error('Error saving terms acceptance:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 max-w-3xl mx-auto">
      <h2 className="text-white text-lg font-bold font-inter">
        DESCARGO DE RESPONSABILIDAD
      </h2>
      
      <div className="mt-4 text-gray-300">
        <p>
          OneMovementGlobal no garantiza la precisión, fiabilidad ni rentabilidad de los resultados generados por el servicio de Copy Trading. El trading es una actividad de renta variable, y los resultados pasados no garantizan rendimientos futuros.
        </p>
        
        {isExpanded && (
          <>
            <p className="mt-3">
              El usuario asume todos los riesgos asociados con el uso de este servicio y reconoce que OneMovementGlobal no será responsable de ninguna pérdida o daño, directo o indirecto, derivado de su uso.
            </p>
            
            <p className="mt-3">
              El servicio de Copy Trading no está exento de riesgos, y su uso puede generar pérdidas. OneMovementGlobal no ofrece asesoría financiera y no se hace responsable de cualquier reclamo, daño o perjuicio que resulte de su utilización.
            </p>
            
            <p className="mt-3">
              El usuario acepta indemnizar y eximir de responsabilidad a OneMovementGlobal, sus afiliados, directivos, empleados y agentes frente a cualquier reclamación o demanda derivada del uso del servicio.
            </p>
            
            <p className="mt-3">
              Este descargo de responsabilidad es parte integral de la relación entre el usuario y OneMovementGlobal, y su aceptación es obligatoria para el uso del servicio.
            </p>
          </>
        )}
        
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-blue-500 flex items-center"
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
          {isExpanded ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </button>
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setIsAccepted(!isAccepted)}
          className="flex items-center"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
            isAccepted ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
          }`}>
            {isAccepted && <Check className="h-4 w-4 text-white" />}
          </div>
          <span className="ml-2 text-white font-bold">
            ACEPTO Y CONFIRMO
          </span>
        </button>
        
        {isAccepted && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-black animate-spin" />
            ) : (
              'CONTINUAR'
            )}
          </Button>
        )}
      </div>
    </div>
  )
} 