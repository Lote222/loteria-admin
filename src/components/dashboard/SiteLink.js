// src/components/dashboard/SiteLink.js
"use client";

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function SiteLink({ site }) {
  const pathname = usePathname();
  const isActive = pathname === `/dashboard/edit/${site.slug}`;

  return (
    // El <li> ahora contiene todo y alinea los elementos
    <li className="flex items-center justify-between mb-2 p-1 rounded-md group  ">
      <Link href={`/dashboard/edit/${site.slug}`} className="flex-grow">
        <div
          className={`font-medium text-sm p-2 rounded-md ${
            isActive
              ? "bg-sky-700 text-white"
              : "bg-gray-100 text-sky-700 text-foreground/70 group-hover:text-sky-500"
          }`}
        >
          {site.label}
        </div>
      </Link>
      
      {site.link && (
        <a
          href={site.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${site.label} en una nueva pestaña`}
          className="p-2 rounded-md text-sky-800 hover:text-sky-500 "
        >
          <ExternalLink className="h-4 w-4 " />
        </a>
      )}
    </li>
  );
}