// src/components/dashboard/DashboardClientLayout.js
"use client";

import { useState } from "react";
import SiteLink from "@/components/dashboard/SiteLink";
import LogoutButton from "@/components/ui/LogoutButton";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function DashboardClientLayout({ websites, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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