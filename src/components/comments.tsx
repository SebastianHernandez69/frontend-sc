"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns";

interface CommentProps{
    idUsuario:number
}

interface Comentario {
    nombre: {
        primerNombre: string,
        primerApellido: string
    },
    foto: string,
    comentario: string,
    fecha: Date
}


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Comments: React.FC<CommentProps> = ({idUsuario}) => {

    const [comentarios, setComentarios] = useState<Comentario[] | null> (null);

    useEffect(() => {
        try {
            const fetchComentarios = async () => {
                const res = await fetch(`${apiUrl}/valoracion/comentarios/get/${idUsuario}`, {
                    method: "GET",
                });
    
                if(!res.ok){
                    console.error(`Error al obtener los comentarios del usuario`);
                }
    
                const data: Comentario[] = await res.json();
                setComentarios(data);
            }
    
            fetchComentarios();
        } catch (error) {
            console.error(`Error al obtener los comentarios: ${error}`);
        }
    }, []);


    return (
        <>
            <div className=" max-h-[30vh] overflow-y-auto">
                {comentarios && (
                    comentarios.map((comentario, idx) => (
                        <div key={idx} className="flex w-full border-t py-2 justify-between">
                            <div className="h-full pl-4">
                                <img className="w-[8vh] sm:w-[13vh] rounded-full" src={comentario.foto} alt="" />
                            </div>
                            <div className="flex flex-col ml-3 items-start pl-1 w-full">
                                <p className="text-xs font-bold">{comentario.nombre.primerNombre} {comentario.nombre.primerApellido}</p>
                                <p className="text-gray-500 text-xs text-left ">
                                    {comentario.comentario.length > 100 
                                    ? comentario.comentario.substring(0, 130) + "..."
                                    : comentario.comentario}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs pr-1 text-gray-500">{format(new Date(comentario.fecha), "dd/MM/yyyy")}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default Comments;