// src/components/dashboard/EditPremioDialog.js
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePremio } from "@/lib/actions";
import { toast } from "sonner";

export function EditPremioDialog({ premio, open, onOpenChange }) {
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    setErrors({});
    startTransition(async () => {
      const result = await updatePremio(premio.id, formData);
      if (result?.errors) {
        setErrors(result.errors);
        toast.error("Error de validación", {
            description: "Por favor, revisa los campos del formulario."
        });
      } else {
        toast.success("¡Premio actualizado con éxito!");
        onOpenChange(false); // Cierra el modal si todo sale bien
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Premio</DialogTitle>
          <DialogDescription>
            Actualiza los detalles de este premio.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="orden">Orden</Label>
              <Input id="orden" name="orden" type="number" defaultValue={premio.orden} className="mt-1" />
              {errors.orden && <p className="text-red-500 text-sm mt-1">{errors.orden[0]}</p>}
            </div>
            <div>
              <Label htmlFor="titulo_acierto">Título del Acierto</Label>
              <Input id="titulo_acierto" name="titulo_acierto" defaultValue={premio.titulo_acierto} className="mt-1" />
              {errors.titulo_acierto && <p className="text-red-500 text-sm mt-1">{errors.titulo_acierto[0]}</p>}
            </div>
            <div>
              <Label htmlFor="descripcion_premio">Descripción del Premio</Label>
              <Input id="descripcion_premio" name="descripcion_premio" defaultValue={premio.descripcion_premio} className="mt-1" />
              {errors.descripcion_premio && <p className="text-red-500 text-sm mt-1">{errors.descripcion_premio[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}