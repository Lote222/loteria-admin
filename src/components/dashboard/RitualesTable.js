"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteRitual } from "@/lib/actions";
import { AddRitualDialog } from "@/components/dashboard/AddRitualDialog";
import { EditRitualDialog } from "@/components/dashboard/EditRitualDialog";

// FIX: La prop ahora es 'websiteSlug'
export default function RitualesTable({ rituales, websiteSlug }) {
  const [isPending, startTransition] = useTransition();
  const [ritualToDelete, setRitualToDelete] = useState(null);
  const [ritualToEdit, setRitualToEdit] = useState(null);

  const handleDelete = () => {
    if (!ritualToDelete) return;
    const formData = new FormData();
    formData.append('id', ritualToDelete.id);
    // FIX: El nombre del campo del formulario es 'website_slug'
    formData.append('website_slug', websiteSlug);

    startTransition(async () => {
      try {
        await deleteRitual(formData);
        toast.success("¡Ritual eliminado con éxito!");
        setRitualToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar", { description: error.message });
      }
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {/* FIX: Pasamos 'websiteSlug' al diálogo */}
        <AddRitualDialog websiteSlug={websiteSlug} />
      </div>

      {rituales.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No hay rituales</h3>
          <p className="text-sm text-gray-500 mt-2">Añade el primer ritual para empezar.</p>
        </div>
      ) : (
        <div className="responsive-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>URL de Imagen</TableHead>
                <TableHead className="text-right w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rituales.map((ritual) => (
                <TableRow key={ritual.id}>
                  <TableCell data-label="Nombre" className="font-medium">{ritual.name}</TableCell>
                  <TableCell data-label="Descripción">{ritual.description}</TableCell>
                  <TableCell data-label="Imagen URL">{ritual.image_url}</TableCell>
                  <TableCell data-label="Acciones" className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="icon" onClick={() => setRitualToEdit(ritual)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => setRitualToDelete(ritual)}>
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

      <AlertDialog open={!!ritualToDelete} onOpenChange={() => setRitualToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción eliminará permanentemente el ritual.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {ritualToEdit && (
        <EditRitualDialog
          ritual={ritualToEdit}
          open={!!ritualToEdit}
          onOpenChange={() => setRitualToEdit(null)}
          // FIX: Pasamos 'websiteSlug' al diálogo de edición
          websiteSlug={websiteSlug}
        />
      )}
    </>
  );
}