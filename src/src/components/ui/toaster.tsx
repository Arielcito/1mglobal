"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-background border border-primary/20 text-foreground"
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-primary font-medium">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-foreground/80">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-foreground/60 hover:text-foreground transition-colors" />
          </Toast>
        )
      })}
      <ToastViewport className="p-4" />
    </ToastProvider>
  )
}