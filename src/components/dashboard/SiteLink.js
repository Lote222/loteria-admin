// src/components/dashboard/SiteLink.js
"use client";

import Link from 'next/link';
import { ExternalLink, Pencil, Ticket } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SiteLink({ site }) {
  const pathname = usePathname();
  // Definimos qué enlace está activo de forma individual
  const isEditingInfo = pathname === `/dashboard/edit/${site.slug}`;
  const isEditingSorteos = pathname === `/dashboard/sorteos/${site.slug}`;

  // La regla de negocio: ¿Este sitio tiene la funcionalidad de sorteos?
  const hasSorteosFeature = site.slug === 'la-balota';

  return (
    <li className="mb-3 p-2 rounded-md group bg-gray-50 border">
      {/* Encabezado del Sitio con Nombre y Enlace Externo */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-gray-800">{site.label}</h3>
        {site.link && (
          <a
            href={site.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${site.label} en una nueva pestaña`}
            className="p-1 rounded-md text-gray-500 hover:text-sky-600 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Contenedor para los botones de acción */}
      <div className="space-y-1">
        {/* Botón para Editar Información (siempre visible) */}
        <Link 
          href={`/dashboard/edit/${site.slug}`} 
          className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
            isEditingInfo
                ? "bg-sky-700 text-white"
                : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar Información
        </Link>

        {/* Botón para Gestionar Sorteos (solo visible si hasSorteosFeature es true) */}
        {hasSorteosFeature && (
          <Link 
            href={`/dashboard/sorteos/${site.slug}`} 
            className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
              isEditingSorteos
                  ? "bg-sky-700 text-white"
                  : "text-gray-600 hover:bg-gray-200"
            }`}
          >
              <Ticket className="mr-2 h-4 w-4" />
              Gestionar Sorteos
          </Link>
        )}
      </div>
    </li>
  );
}