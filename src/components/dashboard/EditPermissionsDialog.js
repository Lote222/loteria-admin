// src/components/dashboard/EditPermissionsDialog.js
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Esta importación ahora funcionará
import { updateUserPermissions } from "@/lib/actions";
import { toast } from "sonner";

export default function EditPermissionsDialog({ userProfile, websites, open, onOpenChange }) {
  const [isPending, startTransition] = useTransition();
  const [selectedSites, setSelectedSites] = useState(userProfile.permissions?.can_view || []);

  const handleCheckboxChange = (slug) => {
    setSelectedSites(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      const newPermissions = { can_view: selectedSites };
      const result = await updateUserPermissions(userProfile.id, newPermissions);

      if (result?.error) {
        toast.error("Error al actualizar", { description: result.error });
      } else {
        toast.success("¡Permisos actualizados!");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Permisos para {userProfile.email}</DialogTitle>
          <DialogDescription>
            Selecciona los sitios web a los que este usuario puede acceder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Sitios web disponibles</Label>
          <div className="space-y-3">
            {websites.map(site => (
              <div key={site.slug} className="flex items-center space-x-2">
                {/* 👇 Usamos el nuevo componente Checkbox */}
                <Checkbox
                  id={site.slug}
                  checked={selectedSites.includes(site.slug)}
                  onCheckedChange={() => handleCheckboxChange(site.slug)}
                />
                <label
                  htmlFor={site.slug}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {site.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}