// src/components/dashboard/AddUserDialog.js
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, KeyRound, Copy } from "lucide-react";
import { createUserWithPassword } from "@/lib/actions";
import { toast } from "sonner";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success("Contraseña copiada al portapapeles");
  };

  async function handleSubmit(formData) {
    formData.set("password", password); // Asegurarnos de que la contraseña del estado se use

    startTransition(async () => {
      const result = await createUserWithPassword(formData);
      if (result?.error) {
        toast.error("Error al crear usuario", { description: result.error });
      } else {
        toast.success("¡Usuario creado con éxito!", { description: `El usuario ${result.user.email} ya puede iniciar sesión.` });
        setOpen(false);
        setPassword("");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Crea una cuenta de usuario con una contraseña. Deberás comunicar la contraseña al usuario de forma segura.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="email">Email del usuario</Label>
              <Input id="email" name="email" type="email" placeholder="usuario@ejemplo.com" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="password" name="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="button" variant="outline" size="icon" onClick={generatePassword} title="Generar contraseña segura">
                  <KeyRound className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={copyToClipboard} title="Copiar contraseña" disabled={!password}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}