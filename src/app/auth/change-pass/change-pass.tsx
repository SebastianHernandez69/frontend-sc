"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setErrorMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    setErrorMessage("");

    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        setMessage("Usuario no autenticado. Por favor, inicia sesión.");
        return;
      }

      const response = await fetch(`${apiUrl}/auth/pass-update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        setMessage("Contraseña actualizada con éxito. Redirigiendo...");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMessage("Error de red o servidor.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleChangePassword}
        className="w-[45vh] sm:w-[60vh] max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="flex justify-center font-bold text-xl">Cambiar Contraseña</div>

        <div>
          <Input
            placeholder="Contraseña Antigua"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          {errorMessage && oldPassword === "" && (
            <p className="text-red-500 text-sm">La contraseña antigua es obligatoria.</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">
              {newPassword.length < 8
                ? "La nueva contraseña debe tener al menos 8 caracteres."
                : ""}
            </p>
          )}
        </div>

        <div>
          <Input
            placeholder="Confirmar Nueva Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errorMessage && newPassword !== confirmPassword && (
            <p className="text-red-500 text-sm">Las contraseñas no coinciden.</p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Actualizar Contraseña
          </Button>
        </div>
        {message && <p className="text-center text-gray-700 font-medium">{message}</p>}
      </form>
    </div>
  );
}
