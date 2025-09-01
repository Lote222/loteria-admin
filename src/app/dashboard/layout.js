// src/app/dashboard/layout.js
import { createClient } from "@/lib/supabase/server";
import DashboardClientLayout from "@/components/dashboard/DashboardClientLayout";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: websites } = await supabase.from("websites").select("*");

  return (
    <DashboardClientLayout websites={websites || []}>
      {children}
    </DashboardClientLayout>
  );
}