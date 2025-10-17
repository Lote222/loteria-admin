"use client";

import Link from 'next/link';
import { ExternalLink, Pencil, Ticket, Trophy, Heart, Award, Star, ChevronDown } from 'lucide-react';

// FIX: Componente interno para los enlaces de gestión, para mantener el código limpio
const ManagementLink = ({ href, icon: Icon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
      isActive ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    <Icon className="mr-2 h-4 w-4" />
    <span>{label}</span>
  </Link>
);

export default function SiteLink({ site, isOpen, onToggle, pathname }) {
  if (!site || !site.slug) {
    return null;
  }

  // Lógica para saber si alguna de las rutas de este sitio está activa
  const isSiteActive = pathname.includes(`/${site.slug}`);

  // Reglas de negocio para mostrar los botones de gestión
  const features = [
    { rule: true, href: `/dashboard/edit/${site.slug}`, icon: Pencil, label: "Editar Información" },
    { rule: site.slug === 'la-balota', href: `/dashboard/sorteos/${site.slug}`, icon: Ticket, label: "Gestionar Sorteos" },
    { rule: site.slug === 'la-balota', href: `/dashboard/premios/${site.slug}`, icon: Trophy, label: "Gestionar Premios" },
    { rule: site.slug === 'herbolaria' || site.slug === 'aromaluz', href: `/dashboard/sorteo-fortuna/${site.slug}`, icon: Star, label: "Sorteo Fortuna" },
    { rule: site.slug === 'herbolaria' || site.slug === 'aromaluz', href: `/dashboard/rituales/${site.slug}`, icon: Heart, label: "Gestionar Rituales" },
  ].filter(f => f.rule);

  return (
    <li className="bg-gray-50 border rounded-lg overflow-hidden">
      {/* Encabezado del Acordeón */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${isSiteActive ? "bg-sky-100/50" : "hover:bg-gray-100"}`}
      >
        <div className="flex items-center">
          <span className={`font-semibold text-sm ${isSiteActive ? "text-sky-800" : "text-gray-800"}`}>{site.label}</span>
        </div>
        <div className="flex items-center">
          {site.link && (
            <a
              href={site.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md text-gray-500 hover:text-sky-600 mr-2"
              onClick={(e) => e.stopPropagation()} // Evita que el acordeón se cierre al hacer clic
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Contenido del Acordeón (opciones de gestión) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-2 space-y-1">
            {features.map(feature => (
              <ManagementLink
                key={feature.href}
                href={feature.href}
                icon={feature.icon}
                label={feature.label}
                isActive={pathname === feature.href}
              />
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}