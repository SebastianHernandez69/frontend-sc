import { useState } from "react";
import { toast } from "react-toastify";

interface UseDeleteQuestionProps {
    updateQuestions: () => Promise<void>;
    accessToken: string;
}

const useDeleteQuestion = ({ updateQuestions, accessToken }: UseDeleteQuestionProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteQuestion = async (idPregunta: number) => {
        if (!accessToken) {
            setError("Usuario no autenticado");
            return;
        }

        setIsDeleting(true);
        setError(null); // Limpiar errores previos

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ idPregunta }),
            });

            if(response.status === 409){
                toast.warning("Pregunta ya contestada o en proceso", {
                    position: "top-right"
                });
                return;
            }

            // Si la respuesta no es correcta, lanza un error
            if (!response.ok) {
                throw new Error(`Error al eliminar la pregunta: ${response.status}`);
            }

            toast.success('Pregunta eliminada con exito', {
                position: "top-right"
            });
            await updateQuestions();

        } catch (error: any) {
            console.error(`Error al eliminar la pregunta: ${error}`)
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteQuestion, isDeleting, error };
};

export default useDeleteQuestion;
