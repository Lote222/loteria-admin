// src/components/dashboard/SorteosTable.js
"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSorteo } from "@/lib/actions";
import { EditSorteoDialog } from "@/components/dashboard/EditSorteoDialog";

export default function SorteosTable({ sorteos }) {
  const [isPending, startTransition] = useTransition();
  const [sorteoToDelete, setSorteoToDelete] = useState(null);
  const [sorteoToEdit, setSorteoToEdit] = useState(null);

  const handleDelete = () => {
    if (!sorteoToDelete) return;
    startTransition(async () => {
      const result = await deleteSorteo(sorteoToDelete.id);
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success("¡Sorteo eliminado con éxito!");
        setSorteoToDelete(null);
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString("es-ES", options);
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
      {/* 👇 1. Envolvemos la tabla con un div y la clase 'responsive-table' */}
      <div className="responsive-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Fecha</TableHead>
              <TableHead className="w-[100px]">Hora</TableHead>
              <TableHead>Lotería</TableHead>
              <TableHead>Serie</TableHead>
              <TableHead>Números Ganadores</TableHead>
              <TableHead className="text-right w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorteos.map((sorteo) => (
              <TableRow key={sorteo.id}>
                {/* 👇 2. Añadimos el atributo 'data-label' a cada celda */}
                <TableCell data-label="Fecha" className="font-medium">{formatDate(sorteo.fecha_sorteo)}</TableCell>
                <TableCell data-label="Hora">{sorteo.hora_sorteo}</TableCell>
                <TableCell data-label="Lotería">{sorteo.nombre_loteria}</TableCell>
                <TableCell data-label="Serie">{sorteo.serie}</TableCell>
                <TableCell data-label="Números Ganadores">
                  <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                    {sorteo.numeros_ganadores.map((num, index) => (
                      <span key={index} className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {num}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell data-label="Acciones" className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="icon" onClick={() => setSorteoToEdit(sorteo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setSorteoToDelete(sorteo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Los diálogos de abajo no cambian --- */}
      <AlertDialog open={!!sorteoToDelete} onOpenChange={() => setSorteoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el resultado del sorteo.
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
        <EditSorteoDialog
          sorteo={sorteoToEdit}
          open={!!sorteoToEdit}
          onOpenChange={() => setSorteoToEdit(null)}
        />
      )}
    </>
  );
}