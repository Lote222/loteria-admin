"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { setHerbolariaManualWinner, runHerbolariaAutomaticSorteo } from "@/lib/actions";

export default function PanelGanador({ sorteo, clientes, website_id }) {
  const [isPending, startTransition] = useTransition();
  const [selectedClientId, setSelectedClientId] = useState(sorteo?.cliente_ganador_id || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const ganadorActual = sorteo?.cliente_ganador_id 
    ? clientes.find(c => c.id === sorteo.cliente_ganador_id)
    : null;

  const handleManualWinner = () => {
    if (!selectedClientId) {
      toast.error("Selecciona un ganador de la lista.");
      return;
    }
    startTransition(async () => {
      const result = await setHerbolariaManualWinner(sorteo.id, selectedClientId);
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success("¡Ganador asignado manualmente!");
      }
    });
  };

  const handleAutomaticSorteo = () => {
    startTransition(async () => {
      const result = await runHerbolariaAutomaticSorteo(sorteo.id);
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success("¡Sorteo Realizado!", { description: "Se ha seleccionado un ganador." });
      }
      setIsAlertOpen(false);
    });
  };

  if (!sorteo) {
    return <p className="text-sm text-muted-foreground">No hay un sorteo programado activo.</p>;
  }
  
  return (
    <>
      <div className="space-y-4">
        <div>
          <Label>Ganador Pre-seleccionado</Label>
          <p className="text-sm font-bold text-indigo-600 mt-1">
            {ganadorActual ? ganadorActual.nombre : "Aún no hay un ganador asignado"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="winner-select">Designar Ganador Manualmente</Label>
          <Select 
            value={selectedClientId} 
            onValueChange={setSelectedClientId}
            disabled={clientes.length === 0} 
          >
            <SelectTrigger id="winner-select">
              <SelectValue placeholder={clientes.length === 0 ? "No hay participantes" : "Selecciona un participante..."} />
            </SelectTrigger>
            <SelectContent>
              {clientes.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleManualWinner} disabled={isPending || !selectedClientId} className="w-full">
            {isPending ? "Guardando..." : "Asignar como Ganador"}
          </Button>
        </div>

        <div className="border-t pt-4 space-y-2">
          <Label>Ejecutar Sorteo Automático</Label>
          <p className="text-xs text-muted-foreground">
            Esta acción seleccionará un ganador al azar y finalizará el sorteo.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setIsAlertOpen(true)} 
            disabled={isPending || clientes.length === 0}
            className="w-full"
          >
            Realizar Sorteo Automático
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Sorteo Automático?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible y marcará el sorteo como &quot;realizado&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAutomaticSorteo} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? "Realizando..." : "Sí, realizar sorteo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}