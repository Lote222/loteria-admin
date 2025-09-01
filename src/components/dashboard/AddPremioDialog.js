// src/components/dashboard/AddPremioDialog.js
"use client";
// (Similar a AddSorteoDialog, pero para premios)

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { addPremio } from "@/lib/actions";
import { toast } from "sonner";

export function AddPremioDialog({ website_id }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    setErrors({});
    startTransition(async () => {
      const result = await addPremio(website_id, formData);
      if (result?.errors) {
        setErrors(result.errors);
        toast.error("Error de validación");
      } else {
        toast.success("¡Premio añadido!");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 sm:mt-0"><PlusCircle className="mr-2 h-4 w-4" />Añadir Premio</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Premio</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="orden">Orden</Label>
              <Input id="orden" name="orden" type="number" className="mt-1" />
              {errors.orden && <p className="text-red-500 text-sm mt-1">{errors.orden[0]}</p>}
            </div>
            <div>
              <Label htmlFor="titulo_acierto">Título del Acierto</Label>
              <Input id="titulo_acierto" name="titulo_acierto" className="mt-1" />
              {errors.titulo_acierto && <p className="text-red-500 text-sm mt-1">{errors.titulo_acierto[0]}</p>}
            </div>
            <div>
              <Label htmlFor="descripcion_premio">Descripción del Premio</Label>
              <Input id="descripcion_premio" name="descripcion_premio" className="mt-1" />
              {errors.descripcion_premio && <p className="text-red-500 text-sm mt-1">{errors.descripcion_premio[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar Premio"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}