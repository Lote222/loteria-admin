// src/app/dashboard/ganadores/[websiteId]/page.js
import { createClient } from "@/lib/supabase/server";
import { getGanadores, getRituales } from '@/lib/actions';
import GanadoresTable from '@/components/dashboard/GanadoresTable';
import { redirect } from "next/navigation";

export default async function GanadoresPage({ params }) {
  // FIX: Renombramos 'websiteId' a 'slug'
  const { websiteId: slug } = params;
  
  const supabase = createClient();
  const { data: website } = await supabase
    .from('websites')
    .select('id, label')
    .eq('slug', slug)
    .single();

  if (!website) {
    redirect('/dashboard');
  }

  const [ganadores, rituales] = await Promise.all([
    getGanadores(website.id),
    getRituales(website.id)
  ]);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Gestionar Ganadores para <span className="text-indigo-600">{website.label}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Añade, edita o elimina los ganadores históricos de los sorteos.
          </p>
        </div>
      </div>
      <GanadoresTable 
        ganadores={ganadores} 
        rituales={rituales} 
        // FIX: Pasamos el 'slug' a la tabla
        websiteSlug={slug} 
      />
    </div>
  );
}