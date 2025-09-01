// src/components/dashboard/AddSorteoDialog.js
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { addSorteo } from "@/lib/actions";
import { toast } from "sonner";

export function AddSorteoDialog({ website_id }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition(); // Hook para manejar el estado de carga

  const handleSubmit = async (formData) => {
    setErrors({});
    
    startTransition(async () => {
      const result = await addSorteo(website_id, formData);

      if (result?.errors) {
        setErrors(result.errors);
        toast.error("Error de validación", {
          description: "Por favor, corrige los campos marcados.",
        });
      } else {
        toast.success("¡Sorteo añadido con éxito!");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Sorteo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Sorteo</DialogTitle>
          <DialogDescription>Rellena los detalles del nuevo resultado.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Campo Fecha */}
            <div>
              <Label htmlFor="fecha_sorteo">Fecha</Label>
              <Input id="fecha_sorteo" name="fecha_sorteo" type="date" className="mt-1" />
              {errors.fecha_sorteo && <p className="text-red-500 text-sm mt-1">{errors.fecha_sorteo[0]}</p>}
            </div>
            {/* Campo Hora */}
            <div>
              <Label htmlFor="hora_sorteo">Hora</Label>
              <Input id="hora_sorteo" name="hora_sorteo" type="time" className="mt-1" />
              {errors.hora_sorteo && <p className="text-red-500 text-sm mt-1">{errors.hora_sorteo[0]}</p>}
            </div>
            {/* Otros campos */}
            <div>
              <Label htmlFor="nombre_loteria">Lotería</Label>
              <Input id="nombre_loteria" name="nombre_loteria" className="mt-1" />
              {errors.nombre_loteria && <p className="text-red-500 text-sm mt-1">{errors.nombre_loteria[0]}</p>}
            </div>
            <div>
              <Label htmlFor="serie">Sorteo #</Label>
              <Input id="serie" name="serie" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="numeros_ganadores">Números (separados por espacio)</Label>
              <Input id="numeros_ganadores" name="numeros_ganadores" placeholder="Ej: 05 12 23 31" className="mt-1" />
              {errors.numeros_ganadores && <p className="text-red-500 text-sm mt-1">{errors.numeros_ganadores[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Sorteo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}