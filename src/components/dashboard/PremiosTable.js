// src/components/dashboard/PremiosTable.js
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
import { deletePremio } from "@/lib/actions";
import { EditPremioDialog } from "@/components/dashboard/EditPremioDialog"; // Asumimos que este componente existirá

export default function PremiosTable({ premios }) {
  const [isPending, startTransition] = useTransition();
  const [premioToDelete, setPremioToDelete] = useState(null);
  const [premioToEdit, setPremioToEdit] = useState(null);

  const handleDelete = () => {
    if (!premioToDelete) return;
    startTransition(async () => {
      const result = await deletePremio(premioToDelete.id);
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success("¡Premio eliminado con éxito!");
        setPremioToDelete(null); // Cierra el diálogo
      }
    });
  };

  if (!premios || premios.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-gray-600">No hay premios</h3>
        <p className="text-sm text-gray-500 mt-2">
          Aún no se han añadido premios.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="responsive-table">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px]">Orden</TableHead>
              <TableHead>Título del Acierto</TableHead>
              <TableHead>Descripción del Premio</TableHead>
              <TableHead className="text-right w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {premios.map((premio) => (
              <TableRow key={premio.id}>
                <TableCell data-label="Orden" className="font-medium">{premio.orden}</TableCell>
                <TableCell data-label="Título">{premio.titulo_acierto}</TableCell>
                <TableCell data-label="Descripción">{premio.descripcion_premio}</TableCell>
                <TableCell data-label="Acciones" className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="icon" onClick={() => setPremioToEdit(premio)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {/* <Button variant="destructive" size="icon" onClick={() => setPremioToDelete(premio)}>
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de Confirmación para Eliminar */}
      <AlertDialog open={!!premioToDelete} onOpenChange={() => setPremioToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el premio.
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

      {/* Modal para Editar (Asegúrate de haber creado EditPremioDialog.js) */}
      {premioToEdit && (
        <EditPremioDialog
          premio={premioToEdit}
          open={!!premioToEdit}
          onOpenChange={() => setPremioToEdit(null)}
        />
      )}
    </>
  );
}