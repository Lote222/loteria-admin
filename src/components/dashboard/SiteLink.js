/* eslint-disable react-hooks/rules-of-hooks */
// src/components/dashboard/SiteLink.js
"use client";

import Link from 'next/link';
import { ExternalLink, Pencil, Ticket, Trophy } from 'lucide-react'; // 1. Importar icono Trophy
import { usePathname } from 'next/navigation';

export default function SiteLink({ site }) {
  if (!site || !site.slug) {
    return null; 
  }

  const pathname = usePathname();
  const isEditingInfo = pathname === `/dashboard/edit/${site.slug}`;
  const isEditingSorteos = pathname === `/dashboard/sorteos/${site.slug}`;
  const isEditingPremios = pathname === `/dashboard/premios/${site.slug}`; // 2. Lógica para enlace activo

  // Reglas de negocio
  const hasSorteosFeature = site.slug === 'la-balota';
  const hasPremiosFeature = site.slug === 'la-balota';

  return (
    <li className="mb-3 p-2 rounded-md group bg-gray-50 border">
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-gray-800">{site.label}</h3>
            {site.link && (
                <a href={site.link} target="_blank" rel="noopener noreferrer" className="p-1 rounded-md text-gray-500 hover:text-sky-600">
                  <ExternalLink className="h-4 w-4" />
                </a>
            )}
        </div>
        <div className="space-y-1">
            <Link 
              href={`/dashboard/edit/${site.slug}`} 
              className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                isEditingInfo ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
              }`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar Información
            </Link>
            {hasSorteosFeature && (
              <Link 
                href={`/dashboard/sorteos/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingSorteos ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Gestionar Sorteos
              </Link>
            )}
            {/* 3. Botón condicional para Premios */}
            {hasPremiosFeature && (
              <Link 
                href={`/dashboard/premios/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingPremios ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Gestionar Premios
              </Link>
            )}
        </div>
    </li>
  );
}