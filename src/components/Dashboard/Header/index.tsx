'use client'

import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { signOut, useSession } from "next-auth/react"
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
import { NotificationsDropdown } from "@/components/Notifications"
import StreamModal from "@/components/Modals/StreamModal"

export const DashboardHeader = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'loading' || !session) return null

  const userName = session.user?.name || 'User Name'
  const userImage = session.user?.image || '/default-avatar.png'

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-stroke-dark bg-zinc from-zinc-900 to-zinc-950 py-6">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-primary text-white">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-lg font-medium text-white">Hola, {userName}!</span>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden md:block">
          <StreamModal session={session} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 text-white hover:bg-dark"
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
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-white hover:bg-dark"
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