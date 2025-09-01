// src/components/dashboard/EditSorteoDialog.js
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
import { updateSorteo } from "@/lib/actions";
import { toast } from "sonner";

export function EditSorteoDialog({ sorteo, open, onOpenChange }) {
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData) => {
    setErrors({});
    startTransition(async () => {
      const result = await updateSorteo(sorteo.id, formData);
      if (result?.errors) {
        setErrors(result.errors);
        toast.error("Error de validación");
      } else {
        toast.success("¡Sorteo actualizado con éxito!");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Sorteo</DialogTitle>
          <DialogDescription>Actualiza los detalles del sorteo.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Campos pre-rellenados con defaultValue */}
            <div>
              <Label htmlFor="fecha_sorteo">Fecha</Label>
              <Input id="fecha_sorteo" name="fecha_sorteo" type="date" defaultValue={sorteo.fecha_sorteo} className="mt-1" />
              {errors.fecha_sorteo && <p className="text-red-500 text-sm mt-1">{errors.fecha_sorteo[0]}</p>}
            </div>
            <div>
              <Label htmlFor="hora_sorteo">Hora</Label>
              <Input id="hora_sorteo" name="hora_sorteo" type="time" defaultValue={sorteo.hora_sorteo} className="mt-1" />
              {errors.hora_sorteo && <p className="text-red-500 text-sm mt-1">{errors.hora_sorteo[0]}</p>}
            </div>
            <div>
              <Label htmlFor="nombre_loteria">Lotería</Label>
              <Input id="nombre_loteria" name="nombre_loteria" defaultValue={sorteo.nombre_loteria} className="mt-1" />
              {errors.nombre_loteria && <p className="text-red-500 text-sm mt-1">{errors.nombre_loteria[0]}</p>}
            </div>
            <div>
              <Label htmlFor="serie">Serie (Opcional)</Label>
              <Input id="serie" name="serie" defaultValue={sorteo.serie} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="numeros_ganadores">Números (separados por espacio)</Label>
              <Input id="numeros_ganadores" name="numeros_ganadores" defaultValue={sorteo.numeros_ganadores.join(' ')} className="mt-1" />
              {errors.numeros_ganadores && <p className="text-red-500 text-sm mt-1">{errors.numeros_ganadores[0]}</p>}
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