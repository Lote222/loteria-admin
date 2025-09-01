// src/app/dashboard/premios/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddPremioDialog } from "@/components/dashboard/AddPremioDialog";
import PremiosTable from "@/components/dashboard/PremiosTable";

export default async function PremiosPage({ params }) {
  const { slug } = params;
  if (slug !== 'la-balota') {
    redirect("/dashboard");
  }

  const supabase = createClient();

  // Hacemos dos consultas separadas:
  // 1. Obtener los datos del sitio web para el título
  const { data: website } = await supabase
    .from("websites")
    .select(`id, label`)
    .eq("slug", slug)
    .single();

  // 2. Obtener TODOS los premios directamente de la tabla 'premios'
  const { data: premiosData, error } = await supabase
    .from("premios")
    .select("*")
    .order("orden", { ascending: true });

  if (!website) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Gestionar Premios
          </h1>
          <p className="text-muted-foreground mt-1">
            Esta es la lista global de premios para los sitios de lotería.
          </p>
        </div>
        {/* <AddPremioDialog /> */}
      </div>
      <PremiosTable premios={premiosData || []} />
    </div>
  );
}