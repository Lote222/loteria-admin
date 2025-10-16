"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteGanador } from "@/lib/actions";
import { AddGanadorDialog } from "@/components/dashboard/AddGanadorDialog";
import { EditGanadorDialog } from "@/components/dashboard/EditGanadorDialog";

// FIX: La prop ahora es 'websiteSlug'
export default function GanadoresTable({ ganadores, rituales, websiteSlug }) {
  const [isPending, startTransition] = useTransition();
  const [ganadorToDelete, setGanadorToDelete] = useState(null);
  const [ganadorToEdit, setGanadorToEdit] = useState(null);

  const handleDelete = () => {
    if (!ganadorToDelete) return;
    const formData = new FormData();
    formData.append('id', ganadorToDelete.id);
    // FIX: Usamos el slug
    formData.append('website_slug', websiteSlug);

    startTransition(async () => {
      try {
        await deleteGanador(formData);
        toast.success("¡Ganador eliminado con éxito!");
        setGanadorToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar", { description: error.message });
      }
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {/* FIX: Pasamos 'websiteSlug' al diálogo */}
        <AddGanadorDialog websiteSlug={websiteSlug} rituales={rituales} />
      </div>

      {ganadores.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No hay ganadores registrados</h3>
          <p className="text-sm text-gray-500 mt-2">Añade el primer ganador.</p>
        </div>
      ) : (
        <div className="responsive-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha del Sorteo</TableHead>
                <TableHead>Nombre del Ganador</TableHead>
                <TableHead>Premio</TableHead>
                <TableHead className="text-right w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ganadores.map((ganador) => (
                <TableRow key={ganador.id}>
                  <TableCell data-label="Fecha Sorteo" className="font-medium">{formatDate(ganador.fecha_sorteo)}</TableCell>
                  <TableCell data-label="Ganador">{ganador.nombre_ganador}</TableCell>
                  <TableCell data-label="Premio">{ganador.nombre_premio}</TableCell>
                  <TableCell data-label="Acciones" className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="icon" onClick={() => setGanadorToEdit(ganador)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => setGanadorToDelete(ganador)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!ganadorToDelete} onOpenChange={() => setGanadorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción eliminará permanentemente a este ganador.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {ganadorToEdit && (
        <EditGanadorDialog
          ganador={ganadorToEdit}
          open={!!ganadorToEdit}
          onOpenChange={() => setGanadorToEdit(null)}
          // FIX: Pasamos 'websiteSlug' al diálogo de edición
          websiteSlug={websiteSlug}
          rituales={rituales}
        />
      )}
    </>
  );
}