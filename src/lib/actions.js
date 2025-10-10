// src/lib/actions.js
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// Importamos la librería base de Supabase para el cliente de admin
import { createClient as createAdminSupabaseClient } from '@supabase/supabase-js';


// --- ESQUEMAS DE VALIDACIÓN ---

const sorteoSchema = z.object({
  fecha_sorteo: z.string().min(1, "La fecha es requerida"),
  hora_sorteo: z.string().min(1, "La hora es requerida"),
  nombre_loteria: z.string().min(3, "El nombre de la lotería es requerido"),
  serie: z.string().optional(),
  numeros_ganadores: z.string().min(1, "Debe haber al menos un número ganador"),
});

const premioSchema = z.object({
  orden: z.coerce.number().int().positive("El orden debe ser un número positivo"),
  titulo_acierto: z.string().min(3, "El título es requerido"),
  descripcion_premio: z.string().min(3, "La descripción es requerida"),
});


// --- ACCIONES PARA SORTEOS ---

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


// --- ACCIONES PARA PREMIOS ---

export async function addPremio(website_id, formData) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = premioSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const { error } = await supabase.from("premios").insert([
    { website_id, ...validatedFields.data },
  ]);

  if (error) {
    return { errors: { _general: ["Error al guardar el premio."] } };
  }

  revalidatePath("/dashboard/premios/la-balota");
  return { success: true };
}

export async function updatePremio(premio_id, formData) {
    const rawData = Object.fromEntries(formData);
    const validatedFields = premioSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }
    
    const supabase = createClient();
    const { error } = await supabase
        .from("premios")
        .update(validatedFields.data)
        .eq("id", premio_id);

    if (error) {
        return { errors: { _general: ["Error al actualizar el premio."] } };
    }

    revalidatePath("/dashboard/premios/la-balota");
    return { success: true };
}

export async function deletePremio(premio_id) {
    const supabase = createClient();
    const { error } = await supabase.from("premios").delete().eq("id", premio_id);

    if (error) {
        return { error: "Hubo un error al eliminar el premio." };
    }

    revalidatePath("/dashboard/premios/la-balota");
    return { success: true };
}


// --- ACCIONES PARA GESTIÓN DE USUARIOS ---

// Helper para crear un cliente de Supabase con rol de administrador (service_role)
const createAdminClient = () => {
  return createAdminSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// Acción para invitar a un nuevo usuario por email
export async function inviteUserByEmail(formData) {
  const email = formData.get("email");
  const emailSchema = z.string().email("El email proporcionado no es válido.");

  const validatedEmail = emailSchema.safeParse(email);
  if (!validatedEmail.success) {
    return { error: validatedEmail.error.flatten().fieldErrors.email[0] };
  }
  
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(validatedEmail.data);

  if (error) {
    console.error("Error al invitar usuario:", error.message);
    return { error: `Error: ${error.message}` };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

// Acción para actualizar los permisos de un usuario
export async function updateUserPermissions(userId, permissions) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ permissions })
    .eq("id", userId);

  if (error) {
    console.error("Error al actualizar permisos:", error.message);
    return { error: `Error: ${error.message}` };
  }
  
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres.");

export async function createUserWithPassword(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const emailValidation = z.string().email().safeParse(email);
  const passwordValidation = passwordSchema.safeParse(password);

  if (!emailValidation.success || !passwordValidation.success) {
    return { error: "Email o contraseña no válidos. La contraseña debe tener al menos 8 caracteres." };
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: emailValidation.data,
    password: passwordValidation.data,
    email_confirm: true, // Marcamos el email como confirmado automáticamente
  });

  if (error) {
    console.error("Error al crear usuario:", error.message);
    return { error: `Error: ${error.message}` };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, user: data.user };
}

// Añadir a src/lib/actions.js
export async function sendPasswordResetEmail(formData) {
  const email = formData.get("email");
  const supabase = createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

// ... (resto de las actions) ...

// --- ACCIONES PARA SORTEO HERBOLARIA (VERSIÓN CORREGIDA) ---

const sorteoConfigSchema = z.object({
  website_id: z.string().uuid(),
  sorteo_modo: z.enum(['semanal', 'mensual', 'especifico']),
  sorteo_fecha_especifica: z.string().nullable().optional(),
});

export async function updateHerbolariaSorteoConfig(formData) {
  const rawData = {
    website_id: formData.get('website_id'),
    sorteo_modo: formData.get('sorteo_modo'),
    sorteo_fecha_especifica: formData.get('sorteo_fecha_especifica'),
  };

  const validatedFields = sorteoConfigSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Datos inválidos." };
  }

  const { website_id, sorteo_modo, sorteo_fecha_especifica } = validatedFields.data;

  if (sorteo_modo === 'especifico' && !sorteo_fecha_especifica) {
    return { error: "Debe seleccionar una fecha para el modo específico." };
  }

  const supabase = createClient();

  // --- LÓGICA CORREGIDA CON UPSERT ---
  const { error } = await supabase
    .from('site_configurations')
    .upsert([
      { 
        website_id: website_id, 
        key: 'sorteo_modo', 
        value: sorteo_modo 
      },
      { 
        website_id: website_id, 
        key: 'sorteo_fecha_especifica', 
        value: sorteo_modo === 'especifico' ? sorteo_fecha_especifica : null 
      }
    ], {
      // Le decimos a Supabase que identifique las filas por la combinación de website_id y key
      onConflict: 'website_id, key' 
    });
  // --- FIN DE LA LÓGICA CORREGIDA ---

  if (error) {
    console.error("Error al hacer upsert en la configuración del sorteo:", error);
    return { error: "Hubo un error al guardar la configuración." };
  }
  
  revalidatePath(`/dashboard/sorteo-herbolaria/herbolaria`);
  return { success: true };
}

// ... (resto de las actions de clientes) ...

// --- ACCIONES PARA CLIENTES DEL SORTEO DE HERBOLARIA ---

const clienteSorteoSchema = z.object({
  nombre_cliente: z.string().min(3, "El nombre es requerido."),
  numero_factura: z.string().min(1, "El número de factura es requerido."),
  fecha_compra: z.string().min(1, "La fecha de compra es requerida."), // <-- CAMPO AÑADIDO
});

// CREATE
export async function addHerbolariaClient(website_id, sorteo_id, formData) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = clienteSorteoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const { error } = await supabase.from("sorteo_clientes").insert([
    { 
      website_id, 
      sorteo_id, // Vinculamos al sorteo actual
      ...validatedFields.data 
    },
  ]);

  if (error) {
    console.error("Error al añadir cliente:", error);
    return { error: "Hubo un error al guardar el cliente." };
  }

  revalidatePath(`/dashboard/sorteo-herbolaria/herbolaria`);
  return { success: true };
}

// UPDATE
export async function updateHerbolariaClient(clientId, formData) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = clienteSorteoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
    
  const supabase = createClient();
  const { error } = await supabase
    .from("sorteo_clientes")
    .update(validatedFields.data)
    .eq("id", clientId);

  if (error) {
    console.error("Error al actualizar cliente:", error);
    return { error: "Hubo un error al actualizar el cliente." };
  }

  revalidatePath(`/dashboard/sorteo-herbolaria/herbolaria`);
  return { success: true };
}

// DELETE
export async function deleteHerbolariaClient(clientId) {
    const supabase = createClient();
    const { error } = await supabase.from("sorteo_clientes").delete().eq("id", clientId);

    if (error) {
        console.error("Error al eliminar cliente:", error);
        return { error: "Hubo un error al eliminar el cliente." };
    }

    revalidatePath(`/dashboard/sorteo-herbolaria/herbolaria`);
    return { success: true };
}

// ... (código existente de actions.js) ...

// --- ACCIONES PARA GESTIONAR EL GANADOR DEL SORTEO DE HERBOLARIA ---

// Acción para designar un ganador manualmente
export async function setHerbolariaManualWinner(sorteo_id, cliente_id) {
  if (!sorteo_id || !cliente_id) {
    return { error: "Faltan datos para asignar el ganador." };
  }
  
  const supabase = createClient();
  // Actualizamos la fila del sorteo para establecer el ID del ganador
  const { error } = await supabase
    .from('sorteo_resultados')
    .update({ cliente_ganador_id: cliente_id })
    .eq('id', sorteo_id);

  if (error) {
    console.error("Error al asignar ganador manual:", error);
    return { error: "No se pudo asignar el ganador." };
  }

  revalidatePath(`/dashboard/sorteo-herbolaria/herbolaria`);
  return { success: true };
}

// Acción para ejecutar el sorteo automático
export async function runHerbolariaAutomaticSorteo(sorteo_id) {
  if (!sorteo_id) {
    return { error: "No se encontró un sorteo programado para ejecutar." };
  }

  const supabase = createClient();
  // Llamamos a la función de PostgreSQL 'realizar_sorteo_automatico'
  const { error } = await supabase.rpc('realizar_sorteo_automatico', {
    sorteo_id_param: sorteo_id
  });

  if (error) {
    console.error("Error al ejecutar el sorteo automático:", error);
    return { error: "La función del sorteo automático falló." };
  }

  revalidatePath(`/dashboard/sorteo-herbolaria/herbolaria`);
  return { success: true, message: "¡Sorteo realizado con éxito!" };
}