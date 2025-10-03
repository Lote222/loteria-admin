// src/app/auth/callback/route.js
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL a la que redirigir al usuario después de iniciar sesión
  return NextResponse.redirect(requestUrl.origin + '/dashboard');
}