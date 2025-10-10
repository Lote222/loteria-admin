"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { addHerbolariaClient } from "@/lib/actions";
import { toast } from "sonner";

export function AddClientDialog({ website_id, sorteo_id }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData) => {
    setErrors({});
    startTransition(async () => {
      const result = await addHerbolariaClient(website_id, sorteo_id, formData);
      if (result?.errors) {
        setErrors(result.errors);
        toast.error("Error de validación", { description: "Por favor, corrige los campos marcados." });
      } else if (result?.error) {
        toast.error("Error al guardar", { description: result.error });
      } else {
        toast.success("¡Cliente añadido con éxito!");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Participante
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Participante</DialogTitle>
          <DialogDescription>Rellena los detalles del cliente para incluirlo en el sorteo actual.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="nombre_cliente">Nombre del Cliente</Label>
              <Input id="nombre_cliente" name="nombre_cliente" className="mt-1" />
              {errors.nombre_cliente && <p className="text-red-500 text-sm mt-1">{errors.nombre_cliente[0]}</p>}
            </div>
            <div>
              <Label htmlFor="numero_factura">Número de Factura</Label>
              <Input id="numero_factura" name="numero_factura" className="mt-1" />
              {errors.numero_factura && <p className="text-red-500 text-sm mt-1">{errors.numero_factura[0]}</p>}
            </div>
            <div>
              <Label htmlFor="fecha_compra">Fecha de Compra</Label>
              <Input id="fecha_compra" name="fecha_compra" type="date" className="mt-1" />
              {errors.fecha_compra && <p className="text-red-500 text-sm mt-1">{errors.fecha_compra[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Participante"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}