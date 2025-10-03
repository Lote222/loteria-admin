// src/app/dashboard/admin/users/page.js
import { createClient } from "@/lib/supabase/server";
import UsersTable from "@/components/dashboard/UsersTable";
import InviteUserDialog from "@/components/dashboard/AddUserDialog";

export default async function AdminUsersPage() {
  const supabase = createClient();

  // Obtenemos todos los perfiles y todos los sitios web
  const { data: profiles } = await supabase.from("profiles").select("*");
  const { data: websites } = await supabase.from("websites").select("slug, label");

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Gestionar Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Invita nuevos usuarios y asigna sus permisos de acceso.
          </p>
        </div>
        <InviteUserDialog />
      </div>
      <UsersTable 
        profiles={profiles || []} 
        websites={websites || []} 
      />
    </div>
  );
}