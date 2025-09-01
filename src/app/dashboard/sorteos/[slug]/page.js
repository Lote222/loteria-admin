// src/app/dashboard/sorteos/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SorteosTable from "@/components/dashboard/SorteosTable";
import { AddSorteoDialog } from "@/components/dashboard/AddSorteoDialog"; // 👈 1. Importar

export default async function SorteosPage({ params }) {
  const { slug } = params;

  if (slug !== 'la-balota') {
    redirect("/dashboard");
  }

  const supabase = createClient();
  const { data: website, error } = await supabase
    .from("websites")
    .select(`id, label, resultados_sorteos ( * )`) // Optimizamos la consulta
    .eq("slug", slug)
    .single();

  if (error || !website) {
    console.error("Error fetching website data for sorteos:", error);
    redirect("/dashboard");
  }

  const sorteos = website.resultados_sorteos.sort(
    (a, b) => new Date(b.fecha_sorteo) - new Date(a.fecha_sorteo)
  );

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Sorteos de: <span className="text-indigo-600">{website.label}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí puedes gestionar los resultados de los sorteos.
          </p>
        </div>
        {/* 👇 2. Reemplazar el botón por el componente del modal */}
        <AddSorteoDialog website_id={website.id} />
      </div>
      <SorteosTable sorteos={sorteos} />
    </div>
  );
}