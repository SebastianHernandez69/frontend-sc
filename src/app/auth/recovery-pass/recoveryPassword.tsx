"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function RecoveryPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  
  const hasUppercase = /[A-Z]/;
  const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]/;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/auth/req-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email }),
      });

      if (response.ok) {
        setMessage("Solicitud de recuperación enviada con éxito.");
        setFormSent(true);
      }else if(response.status === 404){
        setMessage("Usuario no encontrado");
      } 
      else {
        setMessage("Error al enviar la solicitud.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de red o servidor.");
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!hasUppercase.test(newPassword)) {
      setErrorMessage("La contraseña debe incluir al menos una letra mayúscula.");
      return;
    }
    if (!hasSpecialChar.test(newPassword)) {
      setErrorMessage("La contraseña debe incluir al menos un carácter especial.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        setMessage("Éxito, redirigiendo a login...");
        router.push("/auth/login")
      } else {
        setMessage("Error al cambiar la contraseña.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de red o servidor.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-lg space-y-6">

        <h2 className="text-xl font-semibold text-center text-gray-700">Cambiar Contraseña</h2>

        {!formSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-700 font-medium">Correo electrónico:</label>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Enviar
            </Button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-gray-700 font-medium">Correo al que se envió el código:</label>
              <Input
                type="email"
                value={email}
                disabled
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Ingrese el código enviado:</label>
              <Input
                type="text"
                placeholder="Código de verificación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Ingrese nueva contraseña:</label>
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Cambiar Contraseña
            </Button>
          </form>
        )}

        {message && <p className="text-center text-gray-700 font-medium">{message}</p>}
      </div>
    </div>
  );
}
