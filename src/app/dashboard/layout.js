// src/app/dashboard/layout.js
import { createClient, getUserProfile } from "@/lib/supabase/server";
import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const profile = await getUserProfile();

  // La validación de seguridad se mantiene, pero sin los logs
  if (!profile) {
    console.error(`Error crítico: El usuario con ID ${user.id} está autenticado pero no tiene perfil.`);
    // Esta es una ruta de API que creamos para cerrar la sesión de forma segura
    return redirect('/api/auth/logout');
  }
  
  const { data: websites } = await supabase.from("websites").select("*");

  return (
    <DashboardClientLayout websites={websites || []} userProfile={profile}>
      {children}
    </DashboardClientLayout>
  );
}