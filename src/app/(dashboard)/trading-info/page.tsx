'use client'

import { Card } from '@/components/ui/card'
import { Clock, TrendingUp, Activity, Cpu, ChevronRight, DollarSign, Bitcoin, Building2, Gem } from 'lucide-react'
import { cn } from '@/lib/utils'

const TradingInfoPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Introducción */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-white">¿Qué es el Trading?</h1>
        <Card className="p-6 bg-zinc-900/50 border-stroke-dark">
          <p className="text-lg text-gray-300 leading-relaxed">
            El trading es la compra y venta de instrumentos financieros con el objetivo de obtener beneficios de las fluctuaciones de precios en los mercados financieros. Los traders analizan los mercados utilizando diferentes herramientas y estrategias para tomar decisiones informadas sobre sus operaciones.
          </p>
        </Card>
      </section>

      {/* Tipos de Trading */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-primary">Tipos de Trading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Day Trading',
              description: 'Consiste en abrir y cerrar operaciones dentro del mismo día de trading. Los day traders nunca mantienen posiciones abiertas durante la noche y buscan beneficiarse de los movimientos de precio a corto plazo.',
              icon: Clock
            },
            {
              title: 'Swing Trading',
              description: 'Los swing traders mantienen sus posiciones durante varios días o semanas, buscando capturar movimientos más amplios del mercado. Esta estrategia requiere menos tiempo de dedicación que el day trading.',
              icon: Activity
            },
            {
              title: 'Position Trading',
              description: 'Es una estrategia a largo plazo donde las operaciones pueden mantenerse durante meses o años. Los position traders se centran en tendencias fundamentales y movimientos de mercado a largo plazo.',
              icon: TrendingUp
            },
            {
              title: 'Scalping',
              description: 'Es una estrategia de trading muy a corto plazo que busca beneficiarse de pequeños movimientos de precio. Los scalpers realizan múltiples operaciones durante el día, cada una buscando pequeños beneficios.',
              icon: ChevronRight
            },
            {
              title: 'Algorithmic Trading',
              description: 'Utiliza programas informáticos para ejecutar operaciones automáticamente según reglas predefinidas. Los algoritmos pueden analizar múltiples mercados simultáneamente y ejecutar operaciones más rápido que los humanos.',
              icon: Cpu
            }
          ].map((type, index) => (
            <Card 
              key={type.title}
              className={cn(
                "p-6 bg-gradient-to-br from-zinc-900/90 to-black border-stroke-dark hover:border-primary/50 transition-all group",
                index % 2 === 0 ? "md:translate-y-4" : ""
              )}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <type.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">{type.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{type.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Conceptos Importantes */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-primary">Conceptos Importantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Análisis Técnico',
              description: 'Estudio de los movimientos históricos del precio para predecir movimientos futuros utilizando gráficos e indicadores.'
            },
            {
              title: 'Análisis Fundamental',
              description: 'Evaluación de factores económicos, financieros y otros factores externos que pueden afectar el valor de un activo.'
            },
            {
              title: 'Gestión de Riesgo',
              description: 'Estrategias para proteger el capital, incluyendo el uso de stop loss, take profit y la diversificación de la cartera.'
            }
          ].map(concept => (
            <Card 
              key={concept.title}
              className="p-6 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors"
            >
              <h3 className="text-xl font-semibold text-primary mb-3">{concept.title}</h3>
              <p className="text-gray-400">{concept.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Mercados Principales */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-primary">Mercados Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Forex',
              description: 'El mercado de divisas, donde se intercambian pares de monedas.',
              icon: DollarSign
            },
            {
              title: 'Criptomonedas',
              description: 'Mercado de activos digitales como Bitcoin, Ethereum y otras altcoins.',
              icon: Bitcoin
            },
            {
              title: 'Acciones',
              description: 'Compra y venta de participaciones en empresas cotizadas en bolsa.',
              icon: Building2
            },
            {
              title: 'Materias Primas',
              description: 'Trading de commodities como oro, petróleo y productos agrícolas.',
              icon: Gem
            }
          ].map(market => (
            <Card 
              key={market.title}
              className="p-6 bg-gradient-to-br from-zinc-900 to-black/50 border-stroke-dark hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <market.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{market.title}</h3>
                  <p className="text-gray-400">{market.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TradingInfoPage 