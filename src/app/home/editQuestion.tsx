import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { toast } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const EditQuestion = ({ question, updateQuestions, setIsOpen }) => {
    const [editedQuestion, setEditedQuestion] = useState(question); // Almacenar la pregunta que se está editando
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Controlar la visibilidad del dialog de eliminación
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice de la imagen actualmente visible

    // Función para eliminar la imagen
    const handleDeleteImage = async () => {
        const imageToDelete = editedQuestion.imgpregunta[currentImageIndex]; // Obtener la imagen visible actualmente
        const idImg = imageToDelete.idImg; // Obtener el id de la imagen

        const response = await fetch(`${apiUrl}/question/img/delete/${idImg}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Eliminamos la imagen del estado de la pregunta
            const updatedImages = [...editedQuestion.imgpregunta.filter((img,index: number) => index !== currentImageIndex)];

            // Actualizamos el estado de la pregunta
            setEditedQuestion({
                ...editedQuestion,
                imgpregunta: updatedImages, // Actualizamos la lista de imágenes
            });

            // Actualizamos el índice actual si es necesario
            if (currentImageIndex >= updatedImages.length) {
                setCurrentImageIndex(updatedImages.length - 1); // Si eliminamos la última imagen, ajustamos el índice
            }

            toast.success("Imagen eliminada", {
                position: "top-right"
            });
            updateQuestions();
        } else {
            toast.warning("No se pudo eliminar la imagen", {
                position: "top-right"
            });
        }
    };

    // Función para cambiar la imagen actual hacia la izquierda
    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? editedQuestion.imgpregunta.length - 1 : prevIndex - 1));
    };

    // Función para cambiar la imagen actual hacia la derecha
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === editedQuestion.imgpregunta.length - 1 ? 0 : prevIndex + 1));
    };

    // Función para guardar los cambios
    const handleSaveChanges = async () => {
        const response = await fetch(`${apiUrl}/question/update/${editedQuestion.idPregunta}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedQuestion),
        });

        if (response.ok) {
            // Mostrar el dialog de éxito
            toast.success("Pregunta actualizada con exito", {
                position: "top-right"
            });
            handleCloseSuccessDialog();
        } else if (response.status === 409){
            toast.warning("Pregunta ya contesta o aceptada", {
                position: "top-right"
            });
            handleCancel();
        }
         else {
            alert("Hubo un error al guardar los cambios");
        }
    };

    // Función para cerrar el dialog de éxito
    const handleCloseSuccessDialog = () => {
        // setShowSuccessDialog(false);
        updateQuestions(); // Actualizar las preguntas
        setIsOpen(false); // Cerrar el modal de edición
    };

    // Función para cerrar el dialog de eliminación y actualizar
    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false); // Cerrar el dialog de eliminación
        updateQuestions(); // Actualizar las preguntas
    };

    // Función para cancelar y cerrar el modal sin hacer cambios
    const handleCancel = () => {
        setIsOpen(false); // Cerrar el modal sin hacer cambios
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && setIsOpen(false)}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                <DialogContent
                    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full
                        outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll
                    }`}
                >
                    <DialogHeader>
                        <DialogTitle className="font-bold text-center">Editar Pregunta</DialogTitle>
                    </DialogHeader>
                    <div className="w-full border my-2"></div>

                    {/* Formulario de edición */}
                    <div>
                        <label className="block">Título</label>
                        <input
                            type="text"
                            value={editedQuestion.titulo}
                            onChange={(e) => setEditedQuestion({ ...editedQuestion, titulo: e.target.value })}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block">Descripción</label>
                        <textarea
                            value={editedQuestion.descripcion}
                            onChange={(e) => setEditedQuestion({ ...editedQuestion, descripcion: e.target.value })}
                            className="border p-2 w-full"
                        />
                    </div>

                    <div className="w-full border my-2"></div>
                    
                    {/* Carrusel de imágenes con navegación manual */}
                    {editedQuestion.imgpregunta && editedQuestion.imgpregunta.length > 0 && (
                        <div className="relative">
                            {/* Imagen actual */}
                            <div className="w-full flex justify-center items-center">
                                <img
                                    src={editedQuestion.imgpregunta[currentImageIndex].img}
                                    alt="Imagen de la pregunta"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>

                            {/* Controles de navegación */}
                            <div className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2">
                                <button
                                    onClick={handlePreviousImage}
                                    className="text-white bg-black p-2 rounded-full hover:bg-gray-700"
                                >
                                    ←
                                </button>
                            </div>

                            <div className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2">
                                <button
                                    onClick={handleNextImage}
                                    className="text-white bg-black p-2 rounded-full hover:bg-gray-700"
                                >
                                    →
                                </button>
                            </div>

                            {/* Botón para eliminar la imagen actual */}
                            <div className="absolute top-0 right-0 z-10">
                                <button
                                    onClick={handleDeleteImage}
                                    className="text-white bg-red-500 rounded-full p-2 hover:bg-red-700"
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            onClick={handleCancel} // Botón de cancelar
                            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-700 ml-4"
                        >
                            Cancelar
                        </button>
                    </div>
                </DialogContent>
            </DialogPortal>

            {/* Dialog de eliminación de imagen */}
            {showDeleteDialog && (
                <Dialog open={showDeleteDialog} onOpenChange={handleCloseDeleteDialog}>
                    <DialogPortal>
                        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full">
                            <DialogHeader>
                                <DialogTitle className="font-bold text-center">¡Imagen eliminada con éxito!</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handleCloseDeleteDialog}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </DialogContent>
                    </DialogPortal>
                </Dialog>
            )}
        </Dialog>
    );
};

export default EditQuestion;
