import { useState } from 'react';
import { Question } from "./interfaces/question-interface";
import { userPayload } from "./interfaces/userPayload-int";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import Carousel from "@/components/ui/carousel";
import QuestionOffers from "./offers/questionOffers";
import useDeleteQuestion from "../../hooks/useDeleteQuestion"; // Importar el hook
import EditQuestion from "./editQuestion"; // Importar el nuevo componente EditQuestion

interface QuestionCardDialogProps {
    question: Question;
    userData: userPayload | null;
    updateQuestions: () => Promise<void>;
}

const QuestionCardDialog: React.FC<QuestionCardDialogProps> = ({ question, userData, updateQuestions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); // Estado para controlar la apertura de EditQuestion
    const [questionData, setQuestionData] = useState<Question | null>(null); // Almacena los datos de la pregunta al hacer la petición GET

    // Usar el hook para la eliminación de la pregunta
    const { deleteQuestion, isDeleting } = useDeleteQuestion({
        updateQuestions,
        accessToken: sessionStorage.getItem("access_token") || '',
    });

    const handleCardClick = () => {
        setIsOpen(true);
    };

    const handleDelete = async () => {
        // Llamar al hook de eliminación
        await deleteQuestion(question.idPregunta);
        if (!isDeleting) {
            setIsOpen(false); // Cerrar el modal después de eliminar
        }
    };

    const handleUpdate = async () => {
        // Hacer la solicitud GET para obtener los datos actualizados de la pregunta
        const response = await fetch(`http://localhost:3000/question/get/${question.idPregunta}`);
        
        if (response.ok) {
            const data = await response.json();
            setQuestionData(data); // Establecer los datos obtenidos
            setIsEditOpen(true); // Abrir el componente de edición
        } else {
            alert("Hubo un error al obtener la pregunta");
        }
    };
    

    // Verificar si el usuario es tutor (1) o pupilo (2)
    const isPupilo = userData?.rol === 2; // Si el rol es 2, es pupilo

    return (
        <>
            <Card onClick={handleCardClick} className="m-2 overflow-hidden shadow cursor-pointer relative hover:shadow-xl">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        {question.titulo}
                        <span className="text-xs">{question.materia.materia}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="line-clamp-3 overflow-hidden">
                        {question.descripcion}
                    </p>
                    <p className="pt-3">{new Date(question.fechaPublicacion).toLocaleString()}</p>
                </CardContent>
            </Card>

            {/* Modal con detalles de la pregunta */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <DialogContent
                        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full
                            outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll
                        }`}
                    >
                        <DialogHeader>
                            <DialogTitle className="font-bold text-center">{question.titulo}</DialogTitle>
                            <div className="w-full border"></div>
                            <DialogDescription className="text-justify">{question.descripcion}</DialogDescription>
                        </DialogHeader>
                        <div className="w-full border my-2"></div>
                        
                        {/* Carrusel de imágenes */}
                        {question.imgpregunta && question.imgpregunta.length > 0 && (
                            <Carousel images={question.imgpregunta.map(img => img.img)} />
                        )}
                        <p className="text-sm mt-6">
                            Materia: {question.materia.materia}
                        </p>
                        <p className="text-sm">
                            Fecha de publicación: {new Date(question.fechaPublicacion).toLocaleString()}
                        </p>
                        <div className="w-full border my-2"></div>
                        
                        <QuestionOffers userData={userData} selectedQuestion={question} updateQuestions={updateQuestions} />

                        {/* Botón de eliminar solo si el usuario es pupilo y la pregunta no está aceptada */}
                        {isPupilo && question.estado !== "aceptada" && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)} // Muestra la confirmación
                                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-200"
                            >
                                Eliminar
                            </button>
                        )}

                        {/* Confirmación de eliminación */}
                        {showDeleteConfirm && (
                            <div className="mt-4 p-4 border border-red-500 rounded-lg">
                                <p>¿Estás seguro de que deseas eliminar esta pregunta?</p>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-200"
                                    >
                                        Sí, eliminar
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)} // Cierra la confirmación sin eliminar
                                        className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-200"
                                    >
                                        No, cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Botón de actualizar */}
                        {isPupilo && question.estado !== "aceptada" && (
                            <button
                                onClick={handleUpdate} // Llamar a handleUpdate para obtener los datos
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200"
                            >
                                Actualizar
                            </button>
                        )}
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            {/* Mostrar modal de edición si isEditOpen es true */}
            {isEditOpen && questionData && (
                <EditQuestion
                    question={questionData}
                    updateQuestions={updateQuestions}
                    setIsOpen={setIsEditOpen} // Cierra el modal de edición sin afectar el modal principal
                />
            )}
        </>
    );
};

export default QuestionCardDialog;
