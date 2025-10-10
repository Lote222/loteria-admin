// src/app/dashboard/sorteo-herbolaria/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ConfiguracionSorteoForm from "@/components/dashboard/ConfiguracionSorteoForm";
import ClientesSorteoTable from "@/components/dashboard/ClientesSorteoTable";
import PanelGanador from "@/components/dashboard/PanelGanador";

export default async function SorteoHerbolariaPage({ params }) {
  const { slug } = params;

  // Medida de seguridad: Esta página solo debe funcionar para Herbolaria
  if (slug !== 'herbolaria') {
    redirect("/dashboard");
  }

  const supabase = createClient();
  
  // Obtenemos toda la información necesaria del sitio web
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select(`id, label, site_configurations ( key, value )`)
    .eq("slug", slug)
    .single();
    
  // Obtenemos el sorteo programado, incluyendo los clientes y el ganador pre-seleccionado
  const { data: sorteoProgramado, error: sorteoError } = await supabase
    .from('sorteo_resultados')
    .select('*, sorteo_clientes ( * )') // Traemos todos los campos del sorteo y los clientes
    .eq('website_id', website?.id)
    .eq('estado', 'programado')
    .order('fecha_sorteo', { ascending: true })
    .limit(1)
    .single();

  if (websiteError || !website) {
    console.error("Error fetching Herbolaria website data:", websiteError);
    redirect("/dashboard");
  }
  
  // Procesamos la configuración para pasarla al formulario de forma sencilla
  const initialConfig = website.site_configurations.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {});

  const clientes = sorteoProgramado?.sorteo_clientes || [];
  const sorteo_id = sorteoProgramado?.id || null;

  return (
    <div className="space-y-8">
      {/* Cabecera de la página */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold">
          Gestionar Sorteo de: <span className="text-indigo-600">{website.label}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Configura, administra participantes y gestiona los ganadores del Círculo de la Suerte.
        </p>
      </div>

      {/* Contenedor principal con layout de cuadrícula */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Configuración y Ganador */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
             <h2 className="text-lg font-semibold mb-4">Configuración del Sorteo</h2>
            <ConfiguracionSorteoForm 
              websiteId={website.id}
              initialConfig={initialConfig}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
             <h2 className="text-lg font-semibold mb-4">Gestión del Ganador</h2>
            <PanelGanador 
              sorteo={sorteoProgramado}
              clientes={clientes}
            />
          </div>
        </div>

        {/* Columna Derecha: Clientes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold">Clientes Participantes</h2>
           </div>
          <ClientesSorteoTable 
            clientes={clientes}
            website_id={website.id}
            sorteo_id={sorteo_id}
          />
        </div>
      </div>
    </div>
  );
}