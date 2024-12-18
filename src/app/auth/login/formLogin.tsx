"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";

const loginSchema = z.object({
  correo: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("Ingresa un correo válido"),
  password: z.string().nonempty("La contraseña es obligatoria"),
});

type loginDto = z.infer<typeof loginSchema>;
type DecodedToken = { rol: number; isEnabled: boolean }; // Tipo para el token decodificado

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormLogin() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<loginDto>({
    resolver: zodResolver(loginSchema),
  });

  const alertError = (message: string) => {
    toast.warning(`${message}`, {
      position: "top-center",
    });
  };

  const onSubmit: SubmitHandler<loginDto> = async (data) => {
    if (!apiUrl) {
      console.error("La URL de la API no está configurada.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/auth/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alertError("Correo o contraseña inválidos");
        return;
      }

      const responseData = await res.json();
      const access_token = responseData.access_token;

      // Decodificar el JWT para obtener el rol y estado
      const decodedToken = jwtDecode<DecodedToken>(access_token);
      const { rol: userRole, isEnabled } = decodedToken;

      if (!isEnabled) {
        alertError("Usuario deshabilitado. Ponte en contacto con el administrador.");
        return;
      }

      sessionStorage.setItem("access_token", access_token);
      router.refresh();

      // Redirigir según el rol
      if (userRole === 3) {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  
  const handleRecoveryPass = () => {
    router.push("/auth/recovery-pass");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[45vh] sm:w-[60vh] max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="flex justify-center w-full">
          <img src="/images/logo-sc.png" className="w-[25vh]" alt="" />
        </div>
        <div className="flex justify-center font-bold text-xl">Login</div>
        <div>
          <Input placeholder="Correo" {...register("correo")} />
          {errors.correo && (
            <p className="text-red-500 text-sm">{errors.correo.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Contraseña"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <span className="text-sm text-gray-600">¿No tienes una cuenta?</span>
          <a href="/auth/register" className="text-sm ml-1 text-blue-700">
            Registrate
          </a>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Log in
          </Button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="text-sm text-blue-700"
            onClick={() => handleRecoveryPass()}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
}
