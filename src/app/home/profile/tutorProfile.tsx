"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState } from "react";

interface UserProfile {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  secondLastName?: string;
  email?: string;
  age?: number;
  photo?: File | null;
}

export default function ProfileTutor() {
  const { register, handleSubmit, reset } = useForm<UserProfile>();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personalData");
  const [displayName, setDisplayName] = useState("Nombre Apellido");
  const [displayEmail, setDisplayEmail] = useState("correo@example.com");

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<UserProfile> = (data) => {
    console.log("Datos del perfil:", data);
    console.log("Foto del usuario:", photo);

    // Actualizar los datos que se hayan proporcionado
    if (data.firstName || data.lastName) {
      setDisplayName(`${data.firstName || "Nombre"} ${data.lastName || "Apellido"}`);
    }
    if (data.email) {
      setDisplayEmail(data.email);
    }

    // Simular el almacenamiento de la foto
    if (photo) {
      // Aquí puedes agregar la lógica para guardar la foto en el servidor
      console.log("Foto subida:", photo);
    }

    reset();
  };

  // Manejar el cambio de la foto del usuario y generar vista previa
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedPhoto = e.target.files[0];
      setPhoto(selectedPhoto);
      setPhotoPreview(URL.createObjectURL(selectedPhoto));
    }
  };

  return (
    <div className="flex space-x-6">
      {/* Card para la foto de perfil */}
      <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-60">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-500">Foto</span>
          )}
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="my-2 mt-4"
        />
        {photo && <p className="text-sm text-gray-500">Foto seleccionada: {photo.name}</p>}
        <p className="font-medium mt-2">{displayName}</p>
        <p className="text-sm text-gray-500">{displayEmail}</p>
      </div>

      {/* Card para los datos personales */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 max-w-3xl">
        <div className="border-b mb-4 pb-2 flex space-x-6">
          <button
            className={`font-medium ${activeTab === "personalData" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("personalData")}
          >
            Editar Datos personales
          </button>
          <button
            className={`font-medium ${activeTab === "knowledge" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("knowledge")}
          >
            Editar Perfil
          </button>
        </div>

        {/* Contenido dinámico basado en la pestaña activa */}
        {activeTab === "personalData" ? (
          // Formulario de datos personales
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Primer Nombre:</label>
              <Input className="my-2" {...register("firstName")} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Segundo Nombre:</label>
              <Input className="my-2" {...register("middleName")} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Primer Apellido:</label>
              <Input className="my-2" {...register("lastName")} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Segundo Apellido:</label>
              <Input className="my-2" {...register("secondLastName")} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Correo:</label>
              <Input className="my-2" type="email" {...register("email")} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Edad:</label>
              <Input className="my-2" type="number" {...register("age")} />
            </div>
            <Button type="submit">Guardar Cambios</Button>
          </form>
        ) : (
          // Contenido para editar conocimientos
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Categoría:</label>
              <Input className="my-2" placeholder="Agregar categoría" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Conocimientos:</label>
              <Input className="my-2" placeholder="Agregar conocimiento" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Experiencia:</label>
              <Input className="my-2" placeholder="Agregar experiencia" />
            </div>
            <Button>Actualizar Conocimientos</Button>
          </div>
        )}
      </div>
    </div>
  );
}
