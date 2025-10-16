/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Link from 'next/link';
// FIX: Se elimina el ícono 'Star' que ya no se usa.
import { ExternalLink, Pencil, Ticket, Trophy, Heart, Award } from 'lucide-react'; 
import { usePathname } from 'next/navigation';

export default function SiteLink({ site }) {
  if (!site || !site.slug) {
    return null; 
  }

  const pathname = usePathname();
  const isEditingInfo = pathname === `/dashboard/edit/${site.slug}`;
  
  const isEditingSorteosBalota = pathname === `/dashboard/sorteos/${site.slug}`;
  const isEditingPremiosBalota = pathname === `/dashboard/premios/${site.slug}`;

  const isEditingRituales = pathname === `/dashboard/rituales/${site.slug}`;
  const isEditingGanadores = pathname === `/dashboard/ganadores/${site.slug}`;

  // Reglas de negocio para mostrar los botones
  const hasSorteosBalotaFeature = site.slug === 'la-balota';
  const hasPremiosBalotaFeature = site.slug === 'la-balota';
  
  // FIX: Se elimina la variable 'hasHerbolariaSorteoFeature'
  
  const hasRitualesFeature = site.slug === 'herbolaria' || site.slug === 'aromaluz';
  const hasGanadoresFeature = site.slug === 'herbolaria' || site.slug === 'aromaluz';

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

            {/* FIX: Se ha eliminado el bloque de código que renderizaba el enlace "Gestionar Sorteo" */}

            {hasRitualesFeature && (
              <Link 
                href={`/dashboard/rituales/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingRituales ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Heart className="mr-2 h-4 w-4" />
                  Gestionar Rituales
              </Link>
            )}

            {hasGanadoresFeature && (
              <Link 
                href={`/dashboard/ganadores/${site.slug}`} 
                className={`flex items-center font-medium text-sm p-2 rounded-md transition-colors ${
                  isEditingGanadores ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}>
                  <Award className="mr-2 h-4 w-4" />
                  Gestionar Ganadores
              </Link>
            )}
        </div>
    </li>
  );
}