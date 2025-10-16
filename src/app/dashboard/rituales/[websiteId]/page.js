// src/app/dashboard/rituales/[websiteId]/page.js
import { createClient } from "@/lib/supabase/server";
import { getRituales } from '@/lib/actions';
import RitualesTable from "@/components/dashboard/RitualesTable";
import { redirect } from "next/navigation";

export default async function RitualesPage({ params }) {
  // FIX: Renombramos 'websiteId' a 'slug' para mayor claridad.
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
  
  const rituales = await getRituales(website.id);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Gestionar Rituales para <span className="text-indigo-600">{website.label}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Crea, edita y elimina los rituales o paquetes de premios.
          </p>
        </div>
      </div>
      {/* FIX: Pasamos el 'slug' a la tabla como 'websiteSlug' */}
      <RitualesTable rituales={rituales} websiteSlug={slug} />
    </div>
  );
}