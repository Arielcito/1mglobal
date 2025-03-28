'use client'

import * as React from 'react'
import { Video, BookOpen, Key, Upload, Menu, GraduationCap, Sparkles, BookOpenCheck, Users, Bell } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import api from '@/app/libs/axios'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

interface StreamData {
  isLive: boolean
  userId: string
  user: {
    name: string
    image: string
  }
}

const menuPaths = {
  '/dashboard': 'live',
  '/classes': 'classes',
  '/user/keys': 'keys',
  '/upload': 'upload',
  '/courses': 'courses',
  '/news': 'news',
  '/trading-info': 'trading-info',
  '/copy-trading': 'copy-trading',
  '/about': 'about'
} as const

type MenuKeys = keyof typeof menuPaths
type MenuValues = typeof menuPaths[MenuKeys]

export const DashboardSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const { openMobile, setOpenMobile } = useSidebar()

  const activeMenu = React.useMemo(() => {
    const path = pathname as MenuKeys
    return menuPaths[path] || 'live'
  }, [pathname])

  const { data: streamData } = useQuery<StreamData[]>({
    queryKey: ['streams', 'live'],
    queryFn: async () => {
      const { data } = await api.get('/api/streams/live')
      return data
    },
    enabled: !!user?.id
  })

  const handleMenuClick = (menu: MenuValues) => {
    setOpenMobile(false)
    switch (menu) {
      case 'classes':
        router.push('/classes')
        break
      case 'live':
        router.push('/dashboard')
        break
      case 'keys':
        router.push('/user/keys')
        break
      case 'upload':
        router.push('/upload')
        break
      case 'courses':
        router.push('/courses')
        break
      case 'news':
        router.push('/news')
        break
      case 'trading-info':
        router.push('/trading-info')
        break
      case 'copy-trading':
        router.push('/copy-trading')
        break
      case 'about':
        router.push('/about')
        break
    }
  }

  if (isLoading || !user) return null

  const isAdmin = user.isAdmin || false

  return (
    <>
      {/* Botón de menú móvil */}
      <div className="fixed z-50 bottom-4 right-4 md:hidden">
        <SidebarTrigger 
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </div>

      <Sidebar>
        <SidebarHeader className="h-16 border-b border-sidebar-border px-4 py-4 flex justify-center items-center">
          <Image 
            src="/images/logo/logo-white.png" 
            alt="1MomentGlobal" 
            width={100} 
            height={100}
            className="w-auto h-8"
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu className="py-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleMenuClick('about')}
                isActive={activeMenu === 'about'}
                className="flex items-center w-full px-6 py-3 text-base md:text-lg"
              >
                <Users className="mr-3 h-5 w-5" />
                Sobre Nosotros
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleMenuClick('news')}
                isActive={activeMenu === 'news'}
                className="flex items-center w-full px-6 py-3 text-base md:text-lg"
              >
                <Sparkles className="mr-3 h-5 w-5" />
                Novedades
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleMenuClick('trading-info')}
                isActive={activeMenu === 'trading-info'}
                className="flex items-center w-full px-6 py-3 text-base md:text-lg"
              >
                <BookOpenCheck className="mr-3 h-5 w-5" />
                ¿Qué es Trading?
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleMenuClick('copy-trading')}
                isActive={activeMenu === 'copy-trading'}
                className="flex items-center w-full px-6 py-3 text-base md:text-lg"
              >
                <Bell className="mr-3 h-5 w-5" />
                Copy Trading
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleMenuClick('live')}
                isActive={activeMenu === 'live'}
                className="flex items-center justify-between w-full px-6 py-3 text-base md:text-lg"
              >
                <div className="flex items-center">
                  <Video className="mr-3 h-5 w-5" />
                  Live
                </div>
                {streamData?.some(stream => stream.userId === user.id) && (
                  <Badge 
                    variant="destructive" 
                    className="ml-2 animate-pulse bg-primary text-primary-foreground"
                  >
                    EN VIVO
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleMenuClick('classes')}
                isActive={activeMenu === 'classes'}
                className="flex items-center w-full px-6 py-3 text-base md:text-lg"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Clases
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isAdmin && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick('courses')}
                    isActive={activeMenu === 'courses'}
                    className="flex items-center w-full px-6 py-3 text-base md:text-lg"
                  >
                    <GraduationCap className="mr-3 h-5 w-5" />
                    Cursos
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick('keys')}
                    isActive={activeMenu === 'keys'}
                    className="flex items-center w-full px-6 py-3 text-base md:text-lg"
                  >
                    <Key className="mr-3 h-5 w-5" />
                    Stream Keys
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick('upload')}
                    isActive={activeMenu === 'upload'}
                    className="flex items-center w-full px-6 py-3 text-base md:text-lg"
                  >
                    <Upload className="mr-3 h-5 w-5" />
                    Subir Clase
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  )
} 