// src/components/LogoutButton.js
"use client";

import { useRouter } from "next/navigation";
// OJO: Importamos el cliente del NAVEGADOR para esta acción
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirigir al login
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Cerrar Sesión
    </button>
  );
}