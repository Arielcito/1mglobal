'use client'

import { Bell } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: 'stream' | 'signal' | 'alert'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'stream',
    title: '¡TradingPro está en vivo!',
    message: 'Análisis en vivo del mercado asiático - Oportunidades en USD/JPY',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    isRead: false,
  },
  {
    id: '2',
    type: 'signal',
    title: 'Señal de Trading',
    message: 'COMPRA EUR/USD @ 1.0850\nSL: 1.0820\nTP: 1.0900',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    isRead: false,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Alerta de Precio',
    message: 'BTC/USD ha alcanzado tu precio objetivo de $45,000',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    isRead: true,
  },
  {
    id: '4',
    type: 'signal',
    title: 'Señal de Trading',
    message: 'VENTA GBP/JPY @ 185.50\nSL: 186.00\nTP1: 184.50\nTP2: 184.00',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
    isRead: true,
  },
  {
    id: '5',
    type: 'stream',
    title: 'Clase Programada',
    message: 'Recordatorio: Clase de Patrones de Velas Japonesas en 1 hora',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    isRead: true,
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'stream':
        return '🔴'
      case 'signal':
        return '📊'
      case 'alert':
        return '⚠️'
      default:
        return '📬'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs flex items-center justify-center text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Notificaciones</p>
            <span className="text-xs text-muted-foreground">
              {unreadCount} sin leer
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col gap-1 p-3 cursor-pointer",
                !notification.isRead && "bg-muted/50"
              )}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {notification.message}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground self-end">
                {notification.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 