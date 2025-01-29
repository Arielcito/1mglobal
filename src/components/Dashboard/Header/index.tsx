'use client'

import { ChevronDown, LogOut, User, Bell, Info, AlertCircle, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StreamModal from "@/components/Modals/StreamModal"
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { Alert, alertService } from '@/services/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const getAlertIcon = (message: string) => {
  if (message.toLowerCase().includes('error') || message.toLowerCase().includes('advertencia')) {
    return <AlertCircle className="h-5 w-5 text-red-400" />
  }
  if (message.toLowerCase().includes('info') || message.toLowerCase().includes('información')) {
    return <Info className="h-5 w-5 text-primary" />
  }
  return <MessageSquare className="h-5 w-5 text-primary" />
}

const getAlertStyles = (message: string) => {
  if (message.toLowerCase().includes('error') || message.toLowerCase().includes('advertencia')) {
    return 'border-l-4 border-l-red-500 bg-red-500/5'
  }
  if (message.toLowerCase().includes('info') || message.toLowerCase().includes('información')) {
    return 'border-l-4 border-l-primary bg-primary/5'
  }
  return 'border-l-4 border-l-primary bg-primary/5'
}

export const DashboardHeader = () => {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await alertService.getAlerts()
        setAlerts(data)
        setUnreadCount(data.length)
      } catch (error) {
        console.error('Error al cargar las alertas:', error)
      } finally {
        setIsLoadingAlerts(false)
      }
    }

    fetchAlerts()
    
    // Actualizar las alertas cada minuto
    const interval = setInterval(fetchAlerts, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !user) return null

  const userName = user.name || 'User Name'
  const userImage = user.image || '/default-avatar.png'

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-stroke-dark bg-zinc from-zinc-900 to-zinc-950 py-6">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-primary text-white">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-lg font-medium text-white">Hola, {user.email}!</span>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="md:block">
          <StreamModal session={{
            id: user.id,
            name: user.name || null,
            isAdmin: user.isAdmin || false
          }} />
        </div>

        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-white"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-black/95 border-stroke-dark backdrop-blur-sm"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-stroke-dark bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Notificaciones</span>
              </div>
              {isLoadingAlerts && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-breathing" />
                  <span className="text-sm text-primary/80">Cargando...</span>
                </div>
              )}
            </div>
            <ScrollArea className="h-[400px]">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "px-4 py-3 hover:bg-primary/5 transition-colors",
                      getAlertStyles(alert.message)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.message)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white line-clamp-2">{alert.message}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span className="font-medium text-primary">
                            {alert.sender}
                          </span>
                          <span className="inline-block w-1 h-1 rounded-full bg-primary/50" />
                          <span className="whitespace-nowrap text-primary/70">
                            {format(new Date(alert.timestamp), 'dd MMM, HH:mm', { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Bell className="h-12 w-12 text-primary/30 mb-2" />
                  <p className="text-primary/50 text-sm">No hay notificaciones</p>
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Perfil</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className="bg-black border-stroke-dark"
          >
            <DropdownMenuSeparator className="bg-stroke-dark" />
            <DropdownMenuItem 
              onClick={logout}
              className="text-primary hover:bg-primary/10 hover:text-primary"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 