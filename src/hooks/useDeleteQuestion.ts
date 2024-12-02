import { useState } from "react";

interface UseDeleteQuestionProps {
    updateQuestions: () => Promise<void>;
    accessToken: string;
    setSuccessMessage: (message: string) => void;
    setIsLoading: (loading: boolean) => void;
}

const useDeleteQuestion = ({ updateQuestions, accessToken, setSuccessMessage, setIsLoading }: UseDeleteQuestionProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteQuestion = async (idPregunta: number) => {
        if (!accessToken) {
            setError("Usuario no autenticado");
            setSuccessMessage("Error: Usuario no autenticado");
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

            // Si la respuesta no es correcta, lanza un error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar la pregunta.");
            }

            // Mostrar mensaje de éxito
            setSuccessMessage("Eliminando Pregunta.");

            // Esperar 3 segundos para que el mensaje sea visible antes de actualizar
            setTimeout(async () => {
                await updateQuestions();  // Actualizamos la lista de preguntas
            }, 3000); // 3 segundos de retraso

        } catch (error: any) {
            setError(error.message || "Error desconocido");
            setSuccessMessage(error.message || "Error desconocido");
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteQuestion, isDeleting, error };
};

export default useDeleteQuestion;
