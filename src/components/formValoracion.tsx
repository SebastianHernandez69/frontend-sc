"use client"

import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

interface FormValoracionProps{
    idTutor: number | null;
    onClose: () => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Definimos apiUrl

const FormValoracion: React.FC<FormValoracionProps> = ({idTutor, onClose}) => {

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState("");

    const access_token = sessionStorage.getItem("access_token");

    const valorationSuccessfully = () => {
        toast.success("Valoracion enviada con exito", {
            position: "top-right"
        })
    }

    const handleSubmit = async () => {
        if(rating === 0 && (!comentario || comentario.trim() === "")){
            toast.error("Debes ingresar un comentario o valoracion.", {
                position: "top-right"
            });
            return;
        }

        try {
            if(rating > 0){
                await handleSendStars(idTutor,rating);
            }

            if(comentario && comentario.trim() !== ""){
                handleSendComment(idTutor, comentario)
            }

            valorationSuccessfully();
            onClose();
        } catch (error) {
            console.error(`Error al enviar la valoracion o comentario - error: ${error}`);
        }
    }

    const handleSendStars = async (idUsuarioRecibe: number, valoracion: number) => {
        const data = {
            idUsuarioRecibe: idUsuarioRecibe,
            valoracion: valoracion
        }
        
        try {
            const res = await fetch(`${apiUrl}/valoracion/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            if(res.status !== 201){
                console.error("Error al enviar la valoracion");
            }
            
        } catch (error) {
            throw new Error(`Error al enviar la valoracion: ${error}`);
        }
    }
    
    const handleSendComment = async(idUsuarioRecibe: number, comentario: string) => {
        const commentData = {
            idUsuarioRecibeComentario: idUsuarioRecibe,
            comentario: comentario,
        };

        try {
            const res = await fetch(`${apiUrl}/valoracion/comentarios/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commentData),
            });

            if(!res.ok){
                console.error("Error al enviar el comentario");
            }
        } catch (error) {
            console.error("Error al enviar el comentario:", error);
        }
    }

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogPortal>
                    <DialogOverlay className="bg-black bg-opacity-50 fixed inset-0">
                        <DialogContent className="bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
                            <DialogHeader>
                                <DialogTitle className="w-full text-center font-bold">
                                    CALIFICA A TU TUTOR
                                </DialogTitle>
                            </DialogHeader>
                                <form action="">

                                    <div className="flex">
                                        {[1,2,3,4,5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                className="text-xl focus:outline-none"
                                            >
                                                <FaStar color={star <= (hover || rating) ? "gold" : "gray"} />
                                            </button>
                                        ))}
                                    </div>

                                    <Input 
                                        id="comentario" 
                                        placeholder="Escribe tu comentario aquí" 
                                        onChange={(e) => setComentario(e.target.value)}
                                        className="mt-2 mb-4"
                                    >
                                    </Input>
                                    <div>
                                        <Button
                                        type="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        onClick={handleSubmit}
                                        >
                                            Enviar
                                        </Button>
                                    </div>
                                </form>
                        </DialogContent>
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>
        </>
    )
}

export default FormValoracion;