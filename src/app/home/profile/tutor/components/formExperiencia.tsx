"use client"

import { Experience, ExperienceForm } from "@/app/home/interfaces/experience";
import { Puesto } from "@/app/home/interfaces/institucion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExperienceContext } from "@/context/ExperienciaContext";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormExperiencia(){
    const [puestos, setPuestos] = useState<Puesto[] | null>(null);
    const [selectedPuesto, setSelectedPuesto] = useState<number | null>(null);

    const { register, handleSubmit, reset } = useForm<ExperienceForm>()
    const { addExperienciaTutor } = useExperienceContext();
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
        const fetchPuestos = async () => {
            try {
                const res = await fetch(`${apiUrl}/experience/puestos`, {
                    method: "GET"
                });
    
                if(!res.ok){
                    console.error(`Error al obtener las instituciones`);
                }
    
                const data: Puesto[] = await res.json();
                setPuestos(data);

            } catch (error) {
                console.error(`Error al fetchear los puestos: ${error}`);
            }
        } 

        fetchPuestos();
    }, []);

    const onSubmit:SubmitHandler<ExperienceForm> = async (data) => {
        const fechaInicioString = new Date(data.fechaInicio).toISOString();
        const fechaFinString = new Date(data.fechaFin).toISOString();

        const access_token = sessionStorage.getItem("access_token");

        if(!access_token){
            console.log("No token en formExperiencia");
            return;
        }

        const dataForm = {
            idPuesto: data.idPuesto,
            empresa: data.empresa,
            fechaInicio: fechaInicioString,
            fechaFin: fechaFinString,
            descripcion: data.descripcion
        }

        try {
            const res = await fetch(`${apiUrl}/user/experiencia/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataForm)
            });

            if(!res.ok){
                alertFailed("Error al agregar la experiencia al usuario");
                return;
            }

            const data: Experience = await res.json();

            addExperienciaTutor(data);
            alertSuccess("Experiencia agregada con exito");
            reset();
            setSelectedPuesto(null);
        } catch (error) {
            console.error(`Error al agregar experiencia: ${error}`);
        }
    } 

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="puestosSelect" className="text-gray-700 font-medium">
                        Seleccione un puesto
                    </label>
                    <select
                        id="cbInstituciones"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedPuesto ?? ""}
                        {...register("idPuesto", {
                            required: true,
                            onChange: (e) => {
                                const value = Number(e.target.value) || null;
                                setSelectedPuesto(value);
                            }
                        })}
                    >
                        <option value={""}>Seleccione un puesto</option>
                        {puestos?.map((puesto) => (
                            <option value={puesto.idPuesto} key={puesto.idPuesto}>
                                {puesto.puesto}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-gray-700 font-medium">
                        Empresa:
                    </label>
                    <Input
                        className="my-2" 
                        placeholder="Empresa"
                        {...register("empresa", {
                            required: true,
                        })}
                    >
                    </Input>

                    <label className="text-gray-700 font-medium">
                        Fecha de inicio:
                    </label>
                    <Input
                        type="date"
                        className="my-1"
                        {...register("fechaInicio", {required: true})}
                    >
                    </Input>

                    <label className="text-gray-700 font-medium">
                        Fecha de finalizacion:
                    </label>
                    <Input
                        type="date"
                        className="my-1"
                        {...register("fechaFin", {required: true})}
                    >
                    </Input>

                    <label className="text-gray-700 font-medium">
                        Descripcion:
                    </label>
                    <Input
                        className="my-2" 
                        placeholder="Descripcion"
                        {...register("descripcion", {required: true})}
                    >
                    </Input>
                </div>
                <Button type={"submit"}>Agregar experiencia</Button>
            </form>
        </>
    )
}