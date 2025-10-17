"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { addSorteoFortuna } from "@/lib/actions";
import { toast } from "sonner";

export function AddSorteoFortunaDialog({ website_id, slug }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const result = await addSorteoFortuna(website_id, slug, formData);
      if (result?.error) {
         toast.error("Error al guardar", { description: result.error });
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
          Añadir Resultado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Resultado de Sorteo</DialogTitle>
          <DialogDescription>Rellena los detalles del sorteo. El subtítulo se generará automáticamente basado en la fecha.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="fecha_sorteo">Fecha del Sorteo</Label>
              <Input id="fecha_sorteo" name="fecha_sorteo" type="date" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="titulo_premio">Título del Premio (Opcional)</Label>
              <Input id="titulo_premio" name="titulo_premio" placeholder="Ej: PREMIO MAYOR" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="monto_premio">Monto del Premio (Solo el número)</Label>
              <Input id="monto_premio" name="monto_premio" type="number" placeholder="Ej: 870000" className="mt-1" />
            </div>
             <div>
              <Label htmlFor="numeros_ganadores">Números Ganadores (separados por espacio)</Label>
              <Input id="numeros_ganadores" name="numeros_ganadores" placeholder="Ej: 13 14 52" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="numero_suerte">Número de la Suerte (opcional, el dorado)</Label>
              <Input id="numero_suerte" name="numero_suerte" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="numero_sorteo">Número del Sorteo</Label>
              <Input id="numero_sorteo" name="numero_sorteo" placeholder="Ej: sorteo: 1515" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Resultado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}