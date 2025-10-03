// src/components/auth/ForgotPasswordDialog.js
"use client";

import { useState, useTransition, useRef } from "react"; // 👈 1. Importar useRef
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "@/lib/actions";
import { toast } from "sonner";

export default function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef(null); // 👈 2. Crear una referencia para el formulario

  const handleSubmit = async () => {
    // Validar que el formulario exista
    if (!formRef.current) return;

    // Crear el FormData a partir del estado actual del formulario
    const formData = new FormData(formRef.current);
    
    startTransition(async () => {
      const result = await sendPasswordResetEmail(formData);
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success("Correo enviado", {
          description: "Si el correo existe, recibirás un enlace para reiniciar tu contraseña.",
        });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm font-medium">
          ¿Olvidaste tu contraseña?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reiniciar Contraseña</DialogTitle>
          <DialogDescription>
            Introduce tu correo electrónico y te enviaremos un enlace para que puedas crear una nueva contraseña.
          </DialogDescription>
        </DialogHeader>
        {/* 👇 3. Asignar la referencia al formulario y quitar el 'action' */}
        <form ref={formRef}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="mt-1"
                required
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          {/* 👇 4. Llamar a handleSubmit desde el onClick del botón */}
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar Enlace de Recuperación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}