// src/components/dashboard/DashboardClientLayout.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteLink from "@/components/dashboard/SiteLink";
import LogoutButton from "@/components/ui/LogoutButton";
import { Button } from "@/components/ui/button";
import { Menu, X, Users } from "lucide-react";

export default function DashboardClientLayout({ websites, children, userProfile }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Filtra los sitios web a los que el usuario tiene acceso
  const accessibleWebsites = userProfile?.role === 'admin' 
    ? websites // El admin ve todo
    : websites.filter(site => userProfile?.permissions?.can_view?.includes(site.slug));

  const isAdmin = userProfile?.role === 'admin';
  const isUsersPageActive = pathname === '/dashboard/admin/users';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay para cerrar en móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white p-6 shadow-md flex flex-col transform transition-transform z-30 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between lg:justify-start mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">Mis Sitios Web</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-grow">
          <ul>
            {accessibleWebsites?.map((site) => (
              <SiteLink key={site.id} site={site} />
            ))}
          </ul>
          
          {/* Sección de Administración visible solo para admins */}
          {isAdmin && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administración
              </h3>
              <ul className="mt-2">
                <li>
                  <Link
                    href="/dashboard/admin/users"
                    className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                      isUsersPageActive
                        ? "bg-sky-700 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Gestionar Usuarios
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold ml-4">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}