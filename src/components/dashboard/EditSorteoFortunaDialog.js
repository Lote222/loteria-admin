"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSorteoFortuna } from "@/lib/actions";
import { toast } from "sonner";

export function EditSorteoFortunaDialog({ sorteo, open, onOpenChange, slug }) {
  const [isPending, startTransition] = useTransition();

  // Extrae solo el número del monto para el valor por defecto
  const defaultMonto = sorteo.monto_premio ? sorteo.monto_premio.replace(/\D/g, '') : '';

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await updateSorteoFortuna(sorteo.id, slug, formData);
      if (result?.error) {
        toast.error("Error al actualizar", { description: result.error });
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
          <DialogTitle>Editar Resultado de Sorteo</DialogTitle>
          <DialogDescription>Actualiza los detalles de este sorteo.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="fecha_sorteo">Fecha del Sorteo</Label>
              <Input id="fecha_sorteo" name="fecha_sorteo" type="date" defaultValue={sorteo.fecha_sorteo} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="monto_premio">Monto del Premio (Solo el número)</Label>
              <Input id="monto_premio" name="monto_premio" type="number" defaultValue={defaultMonto} placeholder="Ej: 870000" className="mt-1" />
            </div>
             <div>
              <Label htmlFor="numeros_ganadores">Números Ganadores (separados por espacio)</Label>
              <Input id="numeros_ganadores" name="numeros_ganadores" defaultValue={sorteo.numeros_ganadores?.join(' ')} placeholder="Ej: 13 14 52" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="numero_suerte">Número de la Suerte (opcional)</Label>
              <Input id="numero_suerte" name="numero_suerte" defaultValue={sorteo.numero_suerte || ''} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="numero_sorteo">Número del Sorteo</Label>
              <Input id="numero_sorteo" name="numero_sorteo" defaultValue={sorteo.numero_sorteo} className="mt-1" />
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