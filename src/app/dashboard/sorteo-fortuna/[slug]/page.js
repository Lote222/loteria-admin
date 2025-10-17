import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SorteoFortunaTable from "@/components/dashboard/SorteoFortunaTable";
import { AddSorteoFortunaDialog } from "@/components/dashboard/AddSorteoFortunaDialog";

export default async function SorteoFortunaPage({ params }) {
  const { slug } = params;

  if (slug !== 'herbolaria' && slug !== 'aromaluz') {
    redirect("/dashboard");
  }

  const supabase = createClient();
  const { data: website, error } = await supabase
    .from("websites")
    .select(`id, label`)
    .eq("slug", slug)
    .single();

  if (error || !website) {
    console.error("Error fetching website data for sorteo fortuna:", error);
    redirect("/dashboard");
  }

  // Obtenemos los sorteos de la nueva tabla
  const { data: sorteos } = await supabase
    .from("sorteos_fortuna")
    .select('*')
    .eq('website_id', website.id)
    .order('fecha_sorteo', { ascending: false });

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Sorteo de la Fortuna para: <span className="text-indigo-600">{website.label}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí puedes gestionar los resultados de los sorteos. El último sorteo añadido será el que se muestre en la web.
          </p>
        </div>
        <AddSorteoFortunaDialog website_id={website.id} slug={slug} />
      </div>
      <SorteoFortunaTable sorteos={sorteos || []} slug={slug}/>
    </div>
  );
}