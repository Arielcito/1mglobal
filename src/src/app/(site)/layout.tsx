"use client";

import { AuthProvider } from "@/context/AuthContext";
import "../../css/animate.css";
import "../../css/style.css";
import ToasterContext from "../context/ToastContext";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <AuthProvider>
          <ToasterContext />
            <Toaster />
          {children}
        </AuthProvider>
  )
}
