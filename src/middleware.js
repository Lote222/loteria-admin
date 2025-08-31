// src/middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  // Creamos el cliente de Supabase, pero esta vez lo configuramos
  // para que pueda leer y escribir cookies en el contexto del middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Si usamos el cliente en el middleware, necesitamos actualizar las cookies
          // tanto en la petición como en la respuesta.
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          // Lo mismo para eliminar cookies.
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // La lógica de protección de rutas es la misma.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return res
}

// La configuración del matcher no cambia.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}