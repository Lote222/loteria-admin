import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ConfiguracionSorteoForm from "@/components/dashboard/ConfiguracionSorteoForm";
import ClientesSorteoTable from "@/components/dashboard/ClientesSorteoTable";
import PanelGanador from "@/components/dashboard/PanelGanador";

// --- FUNCIÓN HELPER PARA CALCULAR LA FECHA DEL PRÓXIMO SORTEO ---
function getNextSorteoDate(config) {
  const { sorteo_modo, sorteo_fecha_especifica } = config;
  const now = new Date();
  
  // Lógica para Fecha Específica
  if (sorteo_modo === 'especifico' && sorteo_fecha_especifica) {
    // Se añade T00:00:00 para evitar problemas de zona horaria
    const specificDate = new Date(sorteo_fecha_especifica + 'T00:00:00'); 
    // Solo se considera si la fecha es futura
    return specificDate > now ? specificDate : null;
  }

  // Lógica para Semanal (próximo domingo)
  if (sorteo_modo === 'semanal') {
    const nextSunday = new Date(now);
    // Calcula los días que faltan para el próximo domingo
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7); 
    nextSunday.setHours(23, 59, 59, 999); // Se establece al final del día domingo
    return nextSunday;
  }

  // Lógica para Mensual (primer domingo del próximo mes)
  if (sorteo_modo === 'mensual') {
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const firstDay = nextMonth.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const firstSunday = new Date(nextMonth);
    if (firstDay !== 0) { // Si el primer día del mes no es domingo
      firstSunday.setDate(1 + (7 - firstDay)); // Calcula cuántos días añadir para llegar al domingo
    }
    firstSunday.setHours(23, 59, 59, 999);
    return firstSunday;
  }

  return null; // Si no hay configuración válida
}
// --- FIN DE LA FUNCIÓN HELPER ---

export default async function SorteoHerbolariaPage({ params }) {
  const { slug } = params;

  if (slug !== 'herbolaria') {
    redirect("/dashboard");
  }

  const supabase = createClient();
  
  // 1. Obtener la información del sitio web y sus configuraciones
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select(`id, label, site_configurations ( key, value )`)
    .eq("slug", slug)
    .single();

  if (websiteError || !website) {
    console.error("Error fetching Herbolaria website data:", websiteError);
    redirect("/dashboard");
  }
  
  // Convierte las configuraciones en un objeto fácil de usar
  const initialConfig = website.site_configurations.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {});
  
  // 2. Usar la nueva lógica para determinar la fecha del próximo sorteo
  const proximoSorteoFecha = getNextSorteoDate(initialConfig);

  // 3. Obtener la lista completa de clientes para este sitio web
  const { data: clientes } = await supabase
    .from('sorteo_clientes')
    .select('*')
    .eq('website_id', website.id)
    .order('created_at', { ascending: false });

  // 4. Crear un objeto "virtual" de sorteo si hay una fecha futura
  // Esto activa el Panel de Ganador sin depender de la base de datos
  const sorteoActivo = proximoSorteoFecha ? {
    id: 'temp-id-futuro', // ID temporal, ya que aún no existe en la DB
    estado: 'programado',
    fecha_sorteo: proximoSorteoFecha.toISOString(),
  } : null;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold">
          Gestionar Sorteo de: <span className="text-indigo-600">{website.label}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Configura, administra participantes y gestiona los ganadores del Círculo de la Suerte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              sorteo={sorteoActivo}
              clientes={clientes || []}
              website_id={website.id}
            />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold">Clientes Participantes</h2>
           </div>
          <ClientesSorteoTable 
            clientes={clientes || []}
            website_id={website.id}
          />
        </div>
      </div>
    </div>
  );
}