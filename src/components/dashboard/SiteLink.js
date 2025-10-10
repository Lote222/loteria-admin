/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Link from 'next/link';
import { ExternalLink, Pencil, Ticket, Trophy, Star } from 'lucide-react'; // 1. Importar icono 'Star'
import { usePathname } from 'next/navigation';

export default function SiteLink({ site }) {
  if (!site || !site.slug) {
    return null; 
  }

  const pathname = usePathname();
  const isEditingInfo = pathname === `/dashboard/edit/${site.slug}`;
  
  // Lógica para enlaces de "La Balota"
  const isEditingSorteosBalota = pathname === `/dashboard/sorteos/${site.slug}`;
  const isEditingPremiosBalota = pathname === `/dashboard/premios/${site.slug}`;

  // 2. Lógica para el nuevo enlace de "Herbolaria"
  const isEditingSorteoHerbolaria = pathname === `/dashboard/sorteo-herbolaria/${site.slug}`;

  // Reglas de negocio para mostrar los botones
  const hasSorteosBalotaFeature = site.slug === 'la-balota';
  const hasPremiosBalotaFeature = site.slug === 'la-balota';
 const hasHerbolariaSorteoFeature = site.slug === 'herbolaria';

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
            
            {/* Funcionalidades existentes de La Balota */}
            {hasSorteosBalotaFeature && (
              <Link 
                href={`/dashboard/sorteos/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingSorteosBalota ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Gestionar Sorteos
              </Link>
            )}
            {hasPremiosBalotaFeature && (
              <Link 
                href={`/dashboard/premios/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingPremiosBalota ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Gestionar Premios
              </Link>
            )}

            {/* 4. Botón condicional para el Sorteo de Herbolaria */}
            {hasHerbolariaSorteoFeature && (
              <Link 
                href={`/dashboard/sorteo-herbolaria/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingSorteoHerbolaria ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Star className="mr-2 h-4 w-4" />
                  Gestionar Sorteo
              </Link>
            )}
        </div>
    </li>
  );
}