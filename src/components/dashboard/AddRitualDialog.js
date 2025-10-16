"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { createRitual } from "@/lib/actions";
import { toast } from "sonner";

// FIX: La prop ahora es 'websiteSlug'
export function AddRitualDialog({ websiteSlug }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    // FIX: Enviamos el slug en el formulario
    formData.append('website_slug', websiteSlug);
    startTransition(async () => {
      try {
        await createRitual(formData);
        toast.success("¡Ritual añadido con éxito!");
        setOpen(false);
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
          Añadir Ritual
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Ritual</DialogTitle>
          <DialogDescription>Completa los detalles del nuevo ritual.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Nombre del Ritual</Label>
              <Input id="name" name="name" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" name="description" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="image_url">URL de la Imagen</Label>
              <Input id="image_url" name="image_url" placeholder="/rituales/Amor.jpg" className="mt-1" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Ritual"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}