// src/lib/actions.js
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Esquema de validación para el formulario de sorteo (ahora incluye la hora)
const sorteoSchema = z.object({
  fecha_sorteo: z.string().min(1, "La fecha es requerida"),
  hora_sorteo: z.string().min(1, "La hora es requerida"),
  nombre_loteria: z.string().min(3, "El nombre de la lotería es requerido"),
  serie: z.string().optional(),
  numeros_ganadores: z.string().min(1, "Debe haber al menos un número ganador"),
});

// --- ACCIÓN PARA AÑADIR UN NUEVO SORTEO (ACTUALIZADA) ---
export async function addSorteo(website_id, formData) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = sorteoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { fecha_sorteo, hora_sorteo, nombre_loteria, serie, numeros_ganadores } = validatedFields.data;
  const numerosArray = numeros_ganadores.split(/\s+/).filter(Boolean);

  const supabase = createClient();
  const { data, error } = await supabase.from("resultados_sorteos").insert([
    { website_id, fecha_sorteo, hora_sorteo, nombre_loteria, serie, numeros_ganadores: numerosArray },
  ]);

  if (error) {
    console.error("Error al añadir sorteo:", error);
    return { errors: { _general: ["Hubo un error al guardar."] } };
  }

  revalidatePath("/dashboard/sorteos/la-balota");
  return { data };
}

// --- NUEVA ACCIÓN PARA ACTUALIZAR UN SORTEO ---
export async function updateSorteo(sorteo_id, formData) {
    const rawData = Object.fromEntries(formData);
    const validatedFields = sorteoSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const { fecha_sorteo, hora_sorteo, nombre_loteria, serie, numeros_ganadores } = validatedFields.data;
    const numerosArray = numeros_ganadores.split(/\s+/).filter(Boolean);

    const supabase = createClient();
    const { data, error } = await supabase
        .from("resultados_sorteos")
        .update({ fecha_sorteo, hora_sorteo, nombre_loteria, serie, numeros_ganadores: numerosArray })
        .eq("id", sorteo_id);

    if (error) {
        console.error("Error al actualizar sorteo:", error);
        return { errors: { _general: ["Hubo un error al actualizar."] } };
    }

    revalidatePath("/dashboard/sorteos/la-balota");
    return { data };
}


// --- NUEVA ACCIÓN PARA ELIMINAR UN SORTEO ---
export async function deleteSorteo(sorteo_id) {
  const supabase = createClient();
  const { error } = await supabase
    .from("resultados_sorteos")
    .delete()
    .eq("id", sorteo_id);

  if (error) {
    console.error("Error al eliminar sorteo:", error);
    return { error: "Hubo un error al eliminar el sorteo." };
  }

  revalidatePath("/dashboard/sorteos/la-balota");
  return { success: true };
}