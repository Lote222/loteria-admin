// src/app/api/auth/logout/route.js
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient();

  // Cierra la sesión del usuario
  await supabase.auth.signOut();

  // Redirige al usuario a la página de inicio
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(`${requestUrl.origin}/`, {
    // Asegura que el navegador no almacene en caché esta respuesta
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}