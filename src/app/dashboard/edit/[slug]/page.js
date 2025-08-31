// src/app/dashboard/edit/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditorForm from "@/components/dashboard/EditorForm";

export default async function EditSitePage({ params }) {
  const supabase = createClient();
  const { slug } = params;

  // Hacemos una consulta para obtener el sitio y sus configuraciones a la vez
  const { data: website, error } = await supabase
    .from("websites")
    .select(
      `
      *,
      site_configurations ( * )
    `
    )
    .eq("slug", slug)
    .single(); // .single() nos devuelve un solo objeto en lugar de un array

  if (error || !website) {
    // Si no se encuentra el sitio, podríamos redirigir a una página 404
    console.error("Error fetching website data:", error);
    redirect("/dashboard");
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">
        Editando: <span className="text-indigo-600">{website.label}</span>{" "}
      </h1>

      <EditorForm configurations={website.site_configurations} />
    </div>
  );
}
