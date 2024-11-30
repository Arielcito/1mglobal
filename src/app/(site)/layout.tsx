"use client";

import "../../css/animate.css";
import "../../css/style.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import ToasterContext from "../context/ToastContext";
import AuthProvider from "../context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            <ToasterContext />
            <Toaster />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
