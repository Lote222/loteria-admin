"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateHerbolariaClient } from "@/lib/actions";
import { toast } from "sonner";

export function EditClientDialog({ cliente, open, onOpenChange }) {
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  // Helper para formatear la fecha para el input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const handleSubmit = (formData) => {
    setErrors({});
    startTransition(async () => {
      const result = await updateHerbolariaClient(cliente.id, formData);
      if (result?.errors) {
        setErrors(result.errors);
        toast.error("Error de validación");
      } else if (result?.error) {
        toast.error("Error al actualizar", { description: result.error });
      } else {
        toast.success("¡Cliente actualizado con éxito!");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Participante</DialogTitle>
          <DialogDescription>Actualiza los detalles de este participante.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="nombre">Nombre del Cliente</Label>
              <Input id="nombre" name="nombre" defaultValue={cliente.nombre} className="mt-1" />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre[0]}</p>}
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono (Opcional)</Label>
              <Input id="telefono" name="telefono" defaultValue={cliente.telefono || ''} className="mt-1" />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono[0]}</p>}
            </div>
            <div>
              <Label htmlFor="numero_factura">Número de Factura</Label>
              <Input id="numero_factura" name="numero_factura" defaultValue={cliente.numero_factura} className="mt-1" />
              {errors.numero_factura && <p className="text-red-500 text-sm mt-1">{errors.numero_factura[0]}</p>}
            </div>
            <div>
              <Label htmlFor="fecha_compra">Fecha de Compra</Label>
              <Input id="fecha_compra" name="fecha_compra" type="date" defaultValue={formatDateForInput(cliente.fecha_compra)} className="mt-1" />
              {errors.fecha_compra && <p className="text-red-500 text-sm mt-1">{errors.fecha_compra[0]}</p>}
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