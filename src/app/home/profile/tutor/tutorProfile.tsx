"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import FormCategoriaMateria from "./components/formCategoriaInteres";
import { useUserContext } from "@/context/UserContext";
import { useMateriaContext } from "@/context/MateriaTutorContext";
import Comments from "@/components/comments";
import { userPayload } from "../../interfaces/userPayload-int";
import { jwtDecode } from "jwt-decode";
import Valoration from "@/components/valorationStars";
import { useExperienceContext } from "@/context/ExperienciaContext";
import FormConocimiento from "./components/formConocimiento";
import FormExperiencia from "./components/formExperiencia";

interface PerfilTutor {
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  correo?: string;
  edad?: number;
  foto?: File | null;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function PerfilTutor() {
  const { register, handleSubmit, setValue } = useForm<PerfilTutor>();
  const [pestañaActiva, setPestañaActiva] = useState("datosPersonales");
  const [nombreMostrado, setNombreMostrado] = useState("Nombre Apellido");
  const [correoMostrado, setCorreoMostrado] = useState("correo@example.com");
  const [mensaje, setMensaje] = useState("Cargando detalles del perfil...");
  const [token, setToken] = useState<string | null>(null);
  const [esEditable, setEsEditable] = useState(false);
  const [userData, setUserData] = useState<userPayload | null>(null);
  // contexto de usuario
  const {user, updateProfilePhoto} = useUserContext();
  const {conocimientos, experiencias} = useExperienceContext();
  const {materiasTutor} = useMateriaContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const access_token = sessionStorage.getItem("access_token");

      if (!access_token) {
        setMensaje("No estás autenticado. Redirigiendo al inicio de sesión...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
        return;
      }

      setToken(access_token);
      const data: userPayload = jwtDecode(access_token);

      setUserData(data);

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
          setValue("correo", data.correo);
          setValue("edad", data.edad);
          setNombreMostrado(
            `${data.nombre.primerNombre || ""} ${data.nombre.primerApellido || ""}`.trim()
          );
          setCorreoMostrado(data.correo);
          setMensaje("");
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del perfil:", error);
          setMensaje("Error al obtener los detalles del perfil.");
        });
    }
  }, [setValue]);

  const onSubmit = async (data: PerfilTutor) => {
    if (!token) return;

    console.log("Datos enviados al backend:", data);

    try {
      const response = await fetch(`${apiUrl}/user/update-info`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los detalles del perfil.");
      }

      console.log("Perfil actualizado con éxito");
      setNombreMostrado(`${data.primerNombre || ""} ${data.primerApellido || ""}`.trim());
      setCorreoMostrado(data.correo || correoMostrado);
      setEsEditable(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

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
          body: formData
        });

        if(!res.ok){
          console.log(`Error al actualizar la foto de perfil: ${res.status}`);
        }

        const data = await res.json();

        updateProfilePhoto(data.fotoPerfil);
      } catch (error) {
        console.error(`Error al actualizar la foto de perfil: ${error}`);
      }
    }
  };

  if (mensaje) {
    return <p>{mensaje}</p>;
  }

  return (
    <>
    <div className="sm:flex sm:space-x-6 lg:flex-wrap">
      {/* Card para la foto de perfil */}
      <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md sm:w-60 lg:w-[50vh]">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          
            <img src={user?.fotoPerfil ?? undefined} alt="Foto de perfil" className="w-full h-full object-cover" />
          
        </div>
        <label htmlFor="photoUpload" className="text-blue-500 cursor-pointer">
          Cambiar Foto
        </label>
        <Input id="photoUpload" type="file" accept="image/*" onChange={handlePhotoChange} className="my-2 mt-4 max-w-[40vh] hidden" />
        
        <p className="font-medium mt-2">{nombreMostrado}</p>
        <p className="text-sm text-gray-500">{correoMostrado}</p>

        {/* Estrellas de valoración */}
        <p className="pt-4">valoracion</p>
        <Valoration idUsuario={userData?.sub}></Valoration>

        {/* Sección de comentarios */}
          <p className="font-medium ">Comentarios</p>
        <div className="mt-4">
          <Comments idUsuario={userData?.sub}></Comments>
        </div>
      </div>

      {/* Card para los datos personales y pestañas */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 mt-5 max-w-3xl">
        <div className="border-b mb-4 pb-2 flex space-x-6">
          <button
            className={`font-medium ${
              pestañaActiva === "datosPersonales" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("datosPersonales")}
          >
            Datos Personales
          </button>
          <button
            className={`font-medium ${
              pestañaActiva === "materias" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("materias")}
          >
            Materias
          </button>
          <button
            className={`font-medium ${
              pestañaActiva === "conocimientos" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("conocimientos")}
          >
            Conocimientos
          </button>
          <button
            className={`font-medium ${
              pestañaActiva === "experiencia" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setPestañaActiva("experiencia")}
          >
            Experiencia
          </button>
        </div>

        {/* Renderizado condicional de cada pestaña */}
        {pestañaActiva === "datosPersonales" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Datos Personales */}
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Primer Nombre:</label>
              <Input className="my-2" {...register("primerNombre")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Segundo Nombre:</label>
              <Input className="my-2" {...register("segundoNombre")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Primer Apellido:</label>
              <Input className="my-2" {...register("primerApellido")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Segundo Apellido:</label>
              <Input className="my-2" {...register("segundoApellido")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Correo:</label>
              <Input className="my-2" type="email" {...register("correo")} disabled={!esEditable} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Edad:</label>
              <Input className="my-2" type="number" {...register("edad")} disabled={!esEditable} />
            </div>
            <div className="flex space-x-4">
              <Button type="button" onClick={() => setEsEditable(!esEditable)}>
                {esEditable ? "Cancelar" : "Editar"}
              </Button>
              {esEditable && <Button type="submit">Guardar Cambios</Button>}
            </div>
          </form>
        ) : pestañaActiva === "materias" ? (
          <div className="space-y-4">
            {/* Materias */}
            <FormCategoriaMateria/>
          </div>
        ) : pestañaActiva === "conocimientos" ? (
          <div className="space-y-4">
            {/* Conocimientos */}
            <FormConocimiento />
          </div>
        ) : (
          <div className="space-y-4">
              <FormExperiencia/>
          </div>
        )}
      </div>


    </div>
      <div className="grid gap-3 md:grid-cols-3 sm:gap-2 mt-5 lg:gap-4 w-full min-h-[30vh]">
      <div className="h-full bg-white shadow-md rounded">
        <div className="w-auto ml-2 mt-2 lg:ml-4">
          <p className="font-bold">Experiencia</p>
        </div>
        <div className="mt-4">
          {experiencias?.map((experiencia) => (
            <div key={experiencia.idExperiencia} className="mb-3 flex justify-center">
              <div className="w-3/4 bg-white-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="font-medium text-sm text-black-800">
                  <span className="font-bold">{experiencia.empresa}</span>
                  <span> - {experiencia.puesto}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">{experiencia.descripcion}</p>
                <p className="text-xs text-black-500 mt-2">
                  {new Date(experiencia.fechaInicio).toLocaleDateString()} -{" "}
                  {experiencia.fechaFin
                    ? new Date(experiencia.fechaFin).toLocaleDateString()
                    : "Actualmente"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
            <div className="shadow-md bg-white rounded">
                <div className="w-auto ml-2 mt-2 lg:ml-4">
                    <p className="font-bold">Materias de interes</p>
                </div>
                <div className="pl-4 mb-2 text-sm">
                    {materiasTutor?.map((materia, index) => (
                        <p className="flex" key={index}>
                          <Dot/>
                          {materia.materia}
                        </p>
                    ))}
                </div>
            </div>
            <div className="h-full bg-white shadow-md rounded">
              <div className="w-auto ml-2 mt-2 lg:ml-4">
                <p className="font-bold">Conocimientos</p>
              </div>
              <div className="mt-4">
                {conocimientos?.map((conocimiento) => (
                  <div key={conocimiento.idConocimiento} className="mb-3 flex justify-center">
                    <div className="w-3/4 bg-white-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                      <p className="font-medium text-sm text-black-800">
                        <span>{conocimiento.tituloAcademico}</span>
                        <span className="font-bold">, {conocimiento.institucion}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(conocimiento.fechaEgreso).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </>
  );
}