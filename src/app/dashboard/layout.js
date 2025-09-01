// src/app/dashboard/layout.js
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/ui/LogoutButton";
import SiteLink from "@/components/dashboard/SiteLink"; // 👈 1. Importamos el nuevo componente

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: websites } = await supabase.from("websites").select("*");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">Mis Sitios Web</h2>
        <nav className="flex-grow">
          <ul>
            {/* 2. Usamos el componente SiteLink dentro del map */}
            {websites?.map((site) => (
              <SiteLink key={site.id} site={site} />
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
