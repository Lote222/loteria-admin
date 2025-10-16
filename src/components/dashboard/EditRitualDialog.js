"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRitual } from "@/lib/actions";
import { toast } from "sonner";

// FIX: La prop ahora es 'websiteSlug'
export function EditRitualDialog({ ritual, open, onOpenChange, websiteSlug }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    formData.append('id', ritual.id);
    // FIX: Enviamos el slug
    formData.append('website_slug', websiteSlug);

    startTransition(async () => {
      try {
        await updateRitual(formData);
        toast.success("¡Ritual actualizado!");
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
          <DialogTitle>Editar Ritual</DialogTitle>
          <DialogDescription>Actualiza los detalles de este ritual.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Nombre del Ritual</Label>
              <Input id="name" name="name" defaultValue={ritual.name} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" name="description" defaultValue={ritual.description} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="image_url">URL de la Imagen</Label>
              <Input id="image_url" name="image_url" defaultValue={ritual.image_url} className="mt-1" required />
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