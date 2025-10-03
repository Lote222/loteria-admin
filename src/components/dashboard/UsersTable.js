// src/components/dashboard/UsersTable.js
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EditPermissionsDialog from "@/components/dashboard/EditPermissionsDialog";

export default function UsersTable({ profiles, websites }) {
  const [userToEdit, setUserToEdit] = useState(null);

  return (
    <>
      <div className="responsive-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Sitios Permitidos</TableHead>
              <TableHead className="text-right w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell data-label="Email" className="font-medium">{profile.email}</TableCell>
                <TableCell data-label="Rol">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    profile.role === 'admin' 
                    ? 'bg-sky-100 text-sky-800' 
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.role}
                  </span>
                </TableCell>
                <TableCell data-label="Sitios Permitidos">
                  <div className="flex flex-wrap gap-1">
                    {profile.permissions?.can_view?.length > 0
                      ? profile.permissions.can_view.map(slug => (
                          <span key={slug} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            {slug}
                          </span>
                        ))
                      : <span className="text-xs text-gray-500">Ninguno</span>
                    }
                  </div>
                </TableCell>
                <TableCell data-label="Acciones" className="text-right">
                  {profile.role !== 'admin' && (
                    <Button variant="outline" size="icon" onClick={() => setUserToEdit(profile)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {userToEdit && (
        <EditPermissionsDialog
          userProfile={userToEdit}
          websites={websites}
          open={!!userToEdit}
          onOpenChange={() => setUserToEdit(null)}
        />
      )}
    </>
  );
}