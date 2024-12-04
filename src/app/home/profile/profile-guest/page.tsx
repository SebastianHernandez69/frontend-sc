"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dot } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { UserProfile } from "../../interfaces/UserProfile";
import Comments from "@/components/comments";
import Valoration from "@/components/valorationStars";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const GuestContent = () => {
  const searchParams = useSearchParams();
  const idTutor = searchParams.get('tutor');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/profile/view-only/${idTutor}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const resValTutor = await fetch(`${apiUrl}/valoracion/get/${idTutor}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if(!resValTutor.ok){
          throw new Error("Error la valoracion del tutor");
        }

        const data: UserProfile = await response.json();

        setProfileData(data);
      } catch (error) {
        console.error(`Error al obtener la informacion del usuario: ${error}`);
      }

      


    };
    fetchProfileData();
  }, [idTutor]);  // Añadir idTutor como dependencia
  
  const formatTime = (timeString: any) => {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Perfil del tutor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 ">
        <div className="sm:grid grid-cols-1 sm:grid-cols-5 gap-2 lg:gap-4 w-full">
          <div className="shadow col-start-1 col-end-3 rounded min-h-[25vh] sm:min-h-[40vh]">
            <div className="flex justify-center sm:mt-6">
              <img src={profileData?.fotoPerfil} className="mt-5 rounded-full w-[25vh] sm:w-[16vh] sm:h-[16vh]" alt="" />
            </div>
            <div className="flex flex-col text-sm mt-5 text-center">
              <p className="font-thin">{profileData?.nombre.primerNombre} {profileData?.nombre.primerApellido}</p>
              <p className="font-light">{profileData?.correo}</p>
              <p className=" pt-5">Valoracion</p>
              <Valoration idUsuario={Number(idTutor)}></Valoration>

              <p>Comentarios</p>
              <Comments idUsuario={Number(idTutor)}></Comments>
            </div>
          </div>

          <div className="col-start-3 col-end-6 h-auto rounded py-3 mt-4 sm:mt-0 flex items-center justify-center shadow">
            <div className="flex flex-col space-y-2 sm:space-y-5 text-sm">
              <div className="flex mx-3 w-auto">
                <p>Nombre: </p>
                <p className="ml-2">{profileData?.nombre.primerApellido} {profileData?.nombre.segundoNombre} {profileData?.nombre.primerApellido} {profileData?.nombre.segundoApellido}</p>
              </div>
              <div className="flex mx-3 w-auto">
                <p>Edad: </p>
                <p className="ml-2">{profileData?.edad} años</p>
              </div>
              <div className="flex mx-3 w-auto">
                <p>Horario de inicio (inicio):</p>
                <p className="ml-2">{formatTime(profileData?.horarioDisponibleInicio)}</p>
              </div>
              <div className="flex mx-3 w-auto">
                <p>Hora disponible (fin):</p>
                <p className="ml-2">{formatTime(profileData?.horarioDisponibleFin)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 sm:gap-2 lg:gap-4 w-full">
          <div className="h-full shadow rounded">
            <div className="w-auto ml-2 mt-2 lg:ml-4">
              <p className="font-bold">Experiencia</p>
            </div>
            <div>
              {profileData.experiencia?.map((experiencia) => (
                <div key={experiencia.idExperiencia} className="mb-3 flex justify-center">
                  <div className="w-3/4 bg-white-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium text-sm text-black-800">
                      <span className="font-bold">{experiencia.empresa}</span>
                      <span> - {experiencia.puesto.puesto}</span>
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
          <div className="shadow rounded">
            <div className="w-auto ml-2 mt-2 lg:ml-4">
              <p className="font-bold">Materias de interes</p>
            </div>
            <div className="ml-4 mb-2 text-sm">
              {profileData?.materia_tutor?.map((materia) => (
                <p className="flex" key={materia.materia.idMateria}>
                  <Dot />
                  {materia.materia.materia}</p>
              ))}
            </div>
          </div>
          <div className="h-full shadow rounded">
            <div className="w-auto ml-2 mt-2 lg:ml-4">
              <p className="font-bold">Conocimientos</p>
            </div>
            {profileData.conocimiento?.map((conocimiento) => (
                <div key={conocimiento.idConocimiento} className="mb-3 flex justify-center">
                  <div className="w-3/4 bg-white-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="font-medium text-sm text-black-800">
                      <span>{conocimiento.tituloAcademico}</span>
                      <span className="font-bold">, {conocimiento.institucion.institucion}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(conocimiento.fechaEgreso).toLocaleDateString()}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Guest = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <GuestContent />
  </Suspense>
);

export default Guest;
