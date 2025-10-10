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
import { deleteHerbolariaClient } from "@/lib/actions";
import { AddClientDialog } from "@/components/dashboard/AddClientDialog";
import { EditClientDialog } from "@/components/dashboard/EditClientDialog";

export default function ClientesSorteoTable({ clientes, website_id }) {
  const [isPending, startTransition] = useTransition();
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [clienteToEdit, setClienteToEdit] = useState(null);

  const handleDelete = () => {
    if (!clienteToDelete) return;
    startTransition(async () => {
      const result = await deleteHerbolariaClient(clienteToDelete.id);
      if (result?.error) {
        toast.error("Error al eliminar", { description: result.error });
      } else {
        toast.success("¡Participante eliminado con éxito!");
        setClienteToDelete(null);
      }
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {/* El botón para añadir participantes ahora está siempre visible */}
        <AddClientDialog website_id={website_id} />
      </div>

      {clientes.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No hay participantes</h3>
          <p className="text-sm text-gray-500 mt-2">
            Añade clientes a la lista general de participantes del sorteo.
          </p>
        </div>
      ) : (
        <div className="responsive-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Número de Factura</TableHead>
                <TableHead>Fecha Compra</TableHead>
                <TableHead className="text-right w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell data-label="Nombre" className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell data-label="Teléfono">{cliente.telefono}</TableCell>
                  <TableCell data-label="Factura">{cliente.numero_factura}</TableCell>
                  <TableCell data-label="Fecha Compra">{cliente.fecha_compra}</TableCell>
                  <TableCell data-label="Acciones" className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="icon" onClick={() => setClienteToEdit(cliente)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => setClienteToDelete(cliente)}>
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

      {/* Diálogo de Confirmación para Eliminar */}
      <AlertDialog open={!!clienteToDelete} onOpenChange={() => setClienteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al participante de la lista.
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

      {/* Modal para Editar */}
      {clienteToEdit && (
        <EditClientDialog
          cliente={clienteToEdit}
          open={!!clienteToEdit}
          onOpenChange={() => setClienteToEdit(null)}
        />
      )}
    </>
  );
}