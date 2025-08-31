// src/app/layout.js
import './globals.css'
import { Toaster } from "@/components/ui/sonner" // 👈 1. Importar

export const metadata = {
  title: 'Admin Panel',
  description: 'Panel de administración',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors /> {/* 👈 2. Añadir al final del body */}
      </body>
    </html>
  )
}