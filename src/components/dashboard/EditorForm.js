// src/components/dashboard/EditorForm.js
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- DICCIONARIO DE TRADUCCIONES ---
const labelTranslations = {
  address: "Dirección",
  phone_contact: "Teléfono de Contacto",
  email_contact: "Email de Contacto",
  whatsapp_number: "Número de WhatsApp",
  form_recipient_email: "Email para Recibir Formularios",
  // Puedes añadir más traducciones aquí en el futuro
};
// ------------------------------------

export default function EditorForm({ configurations }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const defaultValues = configurations.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({ defaultValues });

  const supabase = createClient();

  const handleConfirm = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!formData) return;

    const promise = new Promise(async (resolve, reject) => {
      try {
        const updatePromises = Object.entries(formData).map(([key, value]) =>
          supabase
            .from("site_configurations")
            .update({ value })
            .eq("key", key)
            .eq("website_id", configurations[0].website_id)
        );
        const results = await Promise.all(updatePromises);
        const failedUpdate = results.find(res => res.error);
        if (failedUpdate) throw new Error(failedUpdate.error.message);
        resolve("¡Datos guardados con éxito!");
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Guardando cambios...',
      success: (message) => message,
      error: (error) => `Error al guardar: ${error.message}`,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleConfirm)} className="space-y-6">
        {configurations.map((config) => (
          <div key={config.id}>
            <label
              htmlFor={config.key}
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {/* Usamos el diccionario para traducir. Si no hay traducción, mostramos la llave original. */}
              {labelTranslations[config.key] || config.key.replace(/_/g, " ")}
            </label>
            <input
              id={config.key}
              {...register(config.key)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        ))}
        <div>
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de guardar los nuevos cambios. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSaveChanges}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Confirmar y Guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}