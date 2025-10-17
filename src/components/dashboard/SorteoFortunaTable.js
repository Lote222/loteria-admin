"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSorteoFortuna } from "@/lib/actions";
import { EditSorteoFortunaDialog } from "@/components/dashboard/EditSorteoFortunaDialog";

export default function SorteoFortunaTable({ sorteos, slug }) {
  const [isPending, startTransition] = useTransition();
  const [sorteoToDelete, setSorteoToDelete] = useState(null);
  const [sorteoToEdit, setSorteoToEdit] = useState(null);

  const handleDelete = () => {
    if (!sorteoToDelete) return;
    startTransition(async () => {
      const result = await deleteSorteoFortuna(sorteoToDelete.id, slug);
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success("¡Sorteo eliminado con éxito!");
        setSorteoToDelete(null);
      }
    });
  };

  if (!sorteos || sorteos.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-gray-600">No hay sorteos</h3>
        <p className="text-sm text-gray-500 mt-2">Aún no se han añadido resultados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="responsive-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto del Premio</TableHead>
              <TableHead>Números Ganadores</TableHead>
              <TableHead className="text-right w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorteos.map((sorteo) => {
              const sorteoDate = new Date(sorteo.fecha_sorteo + 'T00:00:00');
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isEditable = sorteoDate >= today;

              return (
                <TableRow key={sorteo.id}>
                  <TableCell data-label="Fecha">{new Date(sorteo.fecha_sorteo).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</TableCell>
                  <TableCell data-label="Monto">{sorteo.monto_premio}</TableCell>
                  <TableCell data-label="Números">
                    <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                      {sorteo.numeros_ganadores?.map((num, index) => (
                        <span key={index} className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {num}
                        </span>
                      ))}
                      {sorteo.numero_suerte && <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{sorteo.numero_suerte}</span>}
                    </div>
                  </TableCell>
                  <TableCell data-label="Acciones" className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setSorteoToEdit(sorteo)}
                        disabled={!isEditable}
                        title={isEditable ? "Editar sorteo" : "No se puede editar un sorteo que ya pasó"}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => setSorteoToDelete(sorteo)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!sorteoToDelete} onOpenChange={() => setSorteoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el resultado del sorteo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
              {isPending ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {sorteoToEdit && (
        <EditSorteoFortunaDialog
          sorteo={sorteoToEdit}
          open={!!sorteoToEdit}
          onOpenChange={() => setSorteoToEdit(null)}
          slug={slug}
        />
      )}
    </>
  );
}