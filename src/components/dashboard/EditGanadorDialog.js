"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateGanador } from "@/lib/actions";
import { toast } from "sonner";

// FIX: La prop ahora es 'websiteSlug'
export function EditGanadorDialog({ ganador, open, onOpenChange, websiteSlug, rituales }) {
  const [isPending, startTransition] = useTransition();
  const [selectedPremio, setSelectedPremio] = useState(ganador.nombre_premio);
  
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    try { return new Date(dateStr).toISOString().split('T')[0]; } 
    catch (e) { return ''; }
  };

  const handleSubmit = (formData) => {
    formData.append('id', ganador.id);
    // FIX: Enviamos el slug
    formData.append('website_slug', websiteSlug);
    formData.append('nombre_premio', selectedPremio);

    startTransition(async () => {
      try {
        await updateGanador(formData);
        toast.success("¡Ganador actualizado!");
        onOpenChange(false);
      } catch (error) {
        toast.error("Error al actualizar", { description: error.message });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Ganador</DialogTitle>
          <DialogDescription>Actualiza los detalles de este ganador.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="fecha_sorteo">Fecha del Sorteo</Label>
              <Input id="fecha_sorteo" name="fecha_sorteo" type="date" defaultValue={formatDateForInput(ganador.fecha_sorteo)} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="nombre_ganador">Nombre del Ganador</Label>
              <Input id="nombre_ganador" name="nombre_ganador" defaultValue={ganador.nombre_ganador} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="nombre_premio">Premio (Ritual)</Label>
              <Select value={selectedPremio} onValueChange={setSelectedPremio} required>
                <SelectTrigger id="nombre_premio" className="mt-1">
                  <SelectValue placeholder="Selecciona un premio..." />
                </SelectTrigger>
                <SelectContent>
                  {rituales.map(ritual => (
                    <SelectItem key={ritual.id} value={ritual.name}>
                      {ritual.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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