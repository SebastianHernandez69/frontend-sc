"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";

interface ProfileData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  imgPerfil?: string;
  edad: number;
  telefono: string;
  dni: string;
  valoracion: number; // Nuevo campo para la valoración
}

interface ProfileCardProps {
  onEditClick: () => void; // Definir la prop onEditClick
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Definimos apiUrl

export default function ProfileCard({ onEditClick }: ProfileCardProps) {
  const { register, handleSubmit, setValue } = useForm<ProfileData>();
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Cargando detalles del perfil...");
  const [valoracion, setValoracion] = useState<number>(0); // Estado para la valoración
  const { user, updateProfilePhoto } = useUserContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const access_token = sessionStorage.getItem("access_token");

      if (!access_token) {
        setMessage("No estás autenticado. Redirigiendo al inicio de sesión...");
        setTimeout(() => {
          window.location.href = "/login"; // Redirigir si no hay token
        }, 3000);
        return;
      }
      setToken(access_token);
      fetch(`${apiUrl}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los detalles del perfil.");
          }
          return response.json();
        })
        .then((data) => {
          setValue("primerNombre", data.nombre.primerNombre);
          setValue("segundoNombre", data.nombre.segundoNombre);
          setValue("primerApellido", data.nombre.primerApellido);
          setValue("segundoApellido", data.nombre.segundoApellido);
          setValue("edad", data.edad);
          setValue("telefono", data.telefono);
          setValue("dni", data.dni);
          setValoracion(data.valoracion);
          setMessage("");
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del perfil:", error);
          setMessage("Error al obtener los detalles del perfil.");
        });
    }
  }, [setValue]);

  const onSubmit = (data: ProfileData) => {
    console.log("Datos del perfil:", data);
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        console.log("El archivo es demasiado grande");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${apiUrl}/user/update-profile-foto`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          console.log(`Error al actualizar la foto de perfil: ${res.status}`);
        }

        const data = await res.json();
        updateProfilePhoto(data.fotoPerfil);
      } catch (error) {
        console.error(`Error al actualizar la foto de perfil: ${error}`);
      }
    }
  };

  if (message) {
    return <p>{message}</p>;
  }

  // Generar estrellas basadas en la valoración
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-${i <= Math.floor(valoracion) ? "yellow" : "gray"}-500 text-xl`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Foto de Perfil */}
      <div className="flex flex-col items-center space-y-2">
        <img src={user?.fotoPerfil} alt="Foto de Perfil" className="w-24 h-24 rounded-full object-cover" />
        <label htmlFor="photoUpload" className="text-blue-500 cursor-pointer">
          Cambiar Foto
        </label>
        <input type="file" id="photoUpload" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Campos del Perfil (no editables) */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="primerNombre" className="text-gray-700 font-medium">
          Primer Nombre:
        </label>
        <Input id="primerNombre" {...register("primerNombre")} disabled />

        <label htmlFor="segundoNombre" className="text-gray-700 font-medium">
          Segundo Nombre:
        </label>
        <Input id="segundoNombre" {...register("segundoNombre")} disabled />

        <label htmlFor="primerApellido" className="text-gray-700 font-medium">
          Primer Apellido:
        </label>
        <Input id="primerApellido" {...register("primerApellido")} disabled />

        <label htmlFor="segundoApellido" className="text-gray-700 font-medium">
          Segundo Apellido:
        </label>
        <Input id="segundoApellido" {...register("segundoApellido")} disabled />

        <label htmlFor="edad" className="text-gray-700 font-medium">
          Edad:
        </label>
        <Input type="number" id="edad" {...register("edad")} disabled />

        <label htmlFor="telefono" className="text-gray-700 font-medium">
          Número de Teléfono:
        </label>
        <Input id="telefono" {...register("telefono")} disabled />

        <label htmlFor="dni" className="text-gray-700 font-medium">
          DNI:
        </label>
        <Input id="dni" {...register("dni")} disabled />
      </div>

      {/* Estrellas de valoración */}
      <div className="flex space-x-1">{renderStars()}</div>

      <Button type="button" onClick={onEditClick}>
        Actualizar Información
      </Button>
    </form>
  );
}
