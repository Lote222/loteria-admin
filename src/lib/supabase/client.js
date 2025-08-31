// src/lib/supabase/client.js
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Crea un cliente de Supabase para usar en el navegador.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}