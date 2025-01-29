'use client'

import { Card } from '@/components/ui/card'
import { Users, Target, BookOpen, Laptop, Trophy, Building } from 'lucide-react'

const BulletPoint = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-white/90">
    <span className="text-primary text-2xl leading-none">•</span>
    <span className="text-base">{children}</span>
  </div>
)

const Section = ({ title, children, icon: Icon }: { 
  title: string
  children: React.ReactNode
  icon?: any
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
    </div>
    <div className="text-white/90 space-y-4">
      {children}
    </div>
  </div>
)

const AboutPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-12 max-w-5xl">
      {/* Encabezado */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-primary">One Movement Global</h1>
        <Card className="p-6 bg-gradient-to-br from-zinc-900/90 to-black border-stroke-dark">
          <p className="text-lg text-white/90 leading-relaxed">
            1M Global es una comunidad internacional de empresarios digitales que busca impactar la vida de un millón de familias en todo el mundo a través de negocios digitales.
          </p>
        </Card>
      </div>

      {/* Nuestra Alianza */}
      <Section title="Nuestra Alianza" icon={Building}>
        <Card className="p-6 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
          <p className="leading-relaxed">
            Trabajamos con Eaconomy, una empresa sólida y legal constituida hace cuatro años en Los Ángeles, Estados Unidos, con presencia en más de 180 países. El equipo corporativo cuenta con más de 20 años de experiencia en el área administrativa y en el network marketing.
          </p>
        </Card>
      </Section>

      {/* Sistema de Éxito */}
      <Section title="Sistema de Éxito" icon={Target}>
        <p className="mb-4">Nuestro sistema está diseñado para brindarte éxito en áreas clave:</p>
        <div className="space-y-2 pl-4">
          <BulletPoint>Network marketing</BulletPoint>
          <BulletPoint>Trading</BulletPoint>
          <BulletPoint>Redes sociales</BulletPoint>
          <BulletPoint>Mentalidad (Mindset)</BulletPoint>
          <BulletPoint>Liderazgo</BulletPoint>
        </div>
      </Section>

      {/* Recursos y Herramientas */}
      <Section title="Recursos y Herramientas" icon={Laptop}>
        <p className="mb-4">Ofrecemos un conjunto completo de recursos para tu éxito:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
            <BulletPoint>Entrenamientos en vivo</BulletPoint>
          </Card>
          <Card className="p-4 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
            <BulletPoint>Academia de trading</BulletPoint>
          </Card>
          <Card className="p-4 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
            <BulletPoint>Back office completo</BulletPoint>
          </Card>
          <Card className="p-4 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
            <BulletPoint>Software y aplicaciones</BulletPoint>
          </Card>
          <Card className="p-4 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
            <BulletPoint>Tutoriales y biblioteca digital</BulletPoint>
          </Card>
          <Card className="p-4 bg-zinc-900/50 border-stroke-dark hover:bg-primary/5 transition-colors">
            <BulletPoint>Programas de reconocimiento (Club 396 y Master 1-4)</BulletPoint>
          </Card>
        </div>
      </Section>

      {/* Experiencia y Resultados */}
      <Section title="Experiencia y Resultados" icon={Trophy}>
        <Card className="p-6 bg-gradient-to-br from-zinc-900/90 to-black border-stroke-dark hover:border-primary/50 transition-all">
          <p className="leading-relaxed">
            Los fundadores del sistema 1M Global han creado docenas de millonarios en compañías de productos y ahora combinan su experiencia y liderazgo con la rapidez de los negocios digitales para maximizar tu potencial de éxito.
          </p>
        </Card>
      </Section>
    </div>
  )
}

export default AboutPage 