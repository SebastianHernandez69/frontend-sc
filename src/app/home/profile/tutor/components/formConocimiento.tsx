"use client"

import { Conocimiento, ConocimientoForm } from "@/app/home/interfaces/experience";
import { Institucion } from "@/app/home/interfaces/institucion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExperienceContext } from "@/context/ExperienciaContext";
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormConocimiento(){

    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [selectedInstitucion, setSelectedInstitucion] = useState<number | null>(null);
    
    const { register, handleSubmit, reset } = useForm<ConocimientoForm>()
    const { addConocimientoTutor } = useExperienceContext();

    const alertSuccess = (messagge: string) => {
        toast.success(`${messagge}`, {
            position: "top-right"
        });
    }
    const alertFailed = (messagge: string) => {
        toast.warning(`${messagge}`, {
            position: "top-right"
        });
    }

    useEffect(() => {
        const fetchInstituciones = async () => {
            try {
                const res = await fetch(`${apiUrl}/experience/instituciones`, {
                    method: "GET",
                });

                if(!res.ok){
                    console.error(`Error al obtener las instituciones`);
                }

                const data: Institucion[] = await res.json();
                setInstituciones(data);
            } catch (error) {
                console.error(`Error al fetchear las intituciones: ${error}`);
            }
        }

        fetchInstituciones();
    }, []);

    const onSubmit: SubmitHandler<ConocimientoForm> = async (data) => {
        const fechaString = new Date(data.fechaEgreso).toISOString()

        const access_token = sessionStorage.getItem("access_token");

        const dataForm = {
            idInstitucion: data.idInstitucion,
            tituloAcademico: data.tituloAcademico,
            fechaEgreso: fechaString
        }

        if(!access_token){
            console.log("No token en formConocimientos");
            return;
        }

        console.log('Contenido de data: ', dataForm);

        try {
            const res = await fetch(`${apiUrl}/user/conocimiento/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataForm)
            });

            if(!res.ok){
                alertFailed("Error al agregar conocimiento");
                return;
            }

            const data: Conocimiento = await res.json();

            addConocimientoTutor(data);
            alertSuccess("Conocimiento agregado con exito");
            reset();
            setSelectedInstitucion(null);
        } catch (error) {
            console.error(`Error al agregar un conocimiento: ${error}`);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="categorySelect" className="text-gray-700 font-medium">
                        Seleccione una institucion
                    </label>
                    <select
                        id="cbInstituciones"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedInstitucion ?? ""}
                        {...register("idInstitucion", {
                            required: "La institucion es obligatoria",
                            onChange: (e) => {
                                const value = Number(e.target.value) || null;
                                setSelectedInstitucion(value);
                            }
                        })}
                    >
                        <option value={""}>Seleccionar una institucion</option>
                        {instituciones.map((institucion) => (
                            <option value={institucion.idInstitucion} key={institucion.idInstitucion}>
                                {institucion.institucion}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="lblTitulo" className="text-gray-700 font-medium">
                        Titulo academico:
                    </label>
                    <Input 
                        className="my-2" 
                        placeholder="Titulo"
                        {...register("tituloAcademico",{ required: "El titulo es obligatorio"})}    
                    >
                    </Input>
                    <label htmlFor="lblTitulo" className="text-gray-700 font-medium">
                        Fecha de egreso:
                    </label>
                    <Input 
                        type="date"
                        {...register("fechaEgreso",{required: "Fecha obligatoria"})}    
                    ></Input>
                </div>
                <Button type={"submit"}>Agregar conocimiento</Button>
            </form>
        </>
    )
}