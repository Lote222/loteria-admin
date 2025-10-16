"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { createGanador } from "@/lib/actions";
import { toast } from "sonner";

// FIX: La prop ahora es 'websiteSlug'
export function AddGanadorDialog({ websiteSlug, rituales }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedPremio, setSelectedPremio] = useState("");

  const handleSubmit = (formData) => {
    // FIX: Enviamos el slug
    formData.append('website_slug', websiteSlug);
    formData.append('nombre_premio', selectedPremio);

    startTransition(async () => {
      try {
        await createGanador(formData);
        toast.success("¡Ganador añadido con éxito!");
        setOpen(false);
        setSelectedPremio("");
      } catch (error) {
        toast.error("Error al guardar", { description: error.message });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Ganador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Ganador</DialogTitle>
          <DialogDescription>Completa los detalles del ganador.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="fecha_sorteo">Fecha del Sorteo</Label>
              <Input id="fecha_sorteo" name="fecha_sorteo" type="date" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="nombre_ganador">Nombre del Ganador</Label>
              <Input id="nombre_ganador" name="nombre_ganador" placeholder="Ej: Ana G." className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="nombre_premio">Premio (Ritual)</Label>
              <Select onValueChange={setSelectedPremio} required>
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
            <Button type="submit" disabled={isPending || !selectedPremio}>
              {isPending ? "Guardando..." : "Guardar Ganador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}