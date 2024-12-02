"use client"

import { ValoracionUser } from "@/app/home/interfaces/UserProfile";
import { useEffect, useState } from "react";

interface ValorationProps{
    idUsuario:number
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Valoration: React.FC<ValorationProps> = ({idUsuario}) => {

    const [valoracion, setValoracion] = useState<ValoracionUser | null>(null);

    useEffect(() => {
        try {
            const fetchValoracion = async () => {
                const res = await fetch(`${apiUrl}/valoracion/get/${idUsuario}`, {
                    method: "GET"
                });

                if(!res.ok){
                    console.error(`Error al obtener la valoracion del usuario`);
                }

                const data: ValoracionUser = await res.json();
                setValoracion(data);
            }

            fetchValoracion();
        } catch (error) {
            console.error(`Error al obtener valoracion: ${error}`);
        }
    }, []);

    // Función para renderizar las estrellas
    const renderStars = () => {
        if (!valoracion) return null;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`text-${i <= valoracion.promedio ? "yellow" : "gray"}-500`}>
            ★
            </span>
        );
        }
        return stars;
    };

    return(
        <>
            {valoracion ? (
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">
                        {valoracion.promedio.toFixed(2)} ({valoracion.cant})
                    </p>
                    <div className="flex space-x-1 mt-2">{renderStars()}</div>
                </div>
            ) : (
                <p className="text-sm text-gray-500">Cargando valoración...</p>
            )}
        </>
    )
}

export default Valoration;