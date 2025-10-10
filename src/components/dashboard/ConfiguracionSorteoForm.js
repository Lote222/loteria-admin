// src/components/dashboard/ConfiguracionSorteoForm.js
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateHerbolariaSorteoConfig } from "@/lib/actions";

export default function ConfiguracionSorteoForm({ websiteId, initialConfig }) {
  const [isPending, startTransition] = useTransition();
  // Estado para controlar la opción seleccionada en los radio buttons
  const [selectedMode, setSelectedMode] = useState(initialConfig.sorteo_modo || 'semanal');
  // Estado para la fecha específica
  const [specificDate, setSpecificDate] = useState(initialConfig.sorteo_fecha_especifica || '');

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await updateHerbolariaSorteoConfig(formData);
      if (result?.error) {
        toast.error("Error al guardar", { description: result.error });
      } else {
        toast.success("¡Configuración guardada con éxito!");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Campo oculto para enviar el ID del sitio web */}
      <input type="hidden" name="website_id" value={websiteId} />

      {/* Selector de Modo de Sorteo */}
      <RadioGroup
        name="sorteo_modo"
        value={selectedMode}
        onValueChange={setSelectedMode}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="semanal" id="semanal" />
          <Label htmlFor="semanal">Semanal (Cada Domingo)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mensual" id="mensual" />
          <Label htmlFor="mensual">Mensual (Primer Domingo del mes)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="especifico" id="especifico" />
          <Label htmlFor="especifico">Fecha Específica</Label>
        </div>
      </RadioGroup>

      {/* Campo de Fecha (solo visible si el modo es 'especifico') */}
      {selectedMode === 'especifico' && (
        <div className="pt-2">
          <Label htmlFor="sorteo_fecha_especifica">Seleccionar Fecha</Label>
          <Input
            id="sorteo_fecha_especifica"
            name="sorteo_fecha_especifica"
            type="date"
            value={specificDate}
            onChange={(e) => setSpecificDate(e.target.value)}
            className="mt-1"
            required
          />
        </div>
      )}

      {/* Botón de Guardar */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar Configuración"}
      </Button>
    </form>
  );
}