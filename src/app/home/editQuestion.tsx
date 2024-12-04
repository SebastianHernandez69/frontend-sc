import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { toast } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const EditQuestion = ({ question, updateQuestions, setIsOpen }) => {
    const [editedQuestion, setEditedQuestion] = useState(question); // Almacenar la pregunta que se está editando
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Índice de la imagen actualmente visible
    const [fileInput, setFileInput] = useState(null); // Estado para el archivo de la nueva imagen

    // Función para manejar el cambio de archivo
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const selectedFile = files[0]; // Solo tomamos el primer archivo
            setFileInput(selectedFile); // Asignamos el archivo seleccionado
        }
    };

    const handleAddImage = async () => {
        if (!fileInput) {
            toast.warning("Por favor selecciona una imagen", {
                position: "top-right"
            });
            return;
        }
    
        const formData = new FormData();
        formData.append("files", fileInput); // Usamos "files" como la clave esperada en el servidor
    
        try {
            // Enviamos el archivo con FormData a la ruta correcta
            const response = await fetch(`${apiUrl}/question/update/${editedQuestion.idPregunta}`, {
                method: 'PATCH',
                body: formData, // Enviamos la imagen como FormData
            });
    
            if (response.ok) {
                const data = await response.json(); // Obtenemos la respuesta del servidor
                const uploadedImage = data.imgpregunta[data.imgpregunta.length - 1]; // Obtener la última imagen añadida
    
                if (!uploadedImage || !uploadedImage.img) {
                    throw new Error("La imagen subida no se encuentra en la respuesta del servidor.");
                }
    
                // Actualizamos el array de imágenes localmente con la nueva imagen subida
                const updatedImgPregunta = [
                    ...editedQuestion.imgpregunta,
                    uploadedImage, // Usamos la imagen que regresó el servidor
                ];
    
                // Actualizamos el estado local con el nuevo array de imágenes
                setEditedQuestion({
                    ...editedQuestion,
                    imgpregunta: updatedImgPregunta,
                });
    
                // Establecemos el índice del carrusel para la nueva imagen
                setCurrentImageIndex(updatedImgPregunta.length - 1);
    
                // Mostrar mensaje de éxito
                toast.success("Imagen añadida con éxito", {
                    position: "top-right"
                });
                updateQuestions();
                // Limpiamos el input de archivo
                setFileInput(null);
            } else {
                // Mostrar error si no fue exitosa la carga de la imagen
                const errorText = await response.text();
                toast.error(`Error al añadir la imagen: ${errorText}`, {
                    position: "top-right"
                });
            }
        } catch (error) {
            // Mostrar un mensaje de error si ocurre alguna excepción
            toast.error(`Hubo un problema al añadir la imagen: ${error.message}`, {
                position: "top-right"
            });
        }
    };
    
    
    
    

    // Función para eliminar la imagen
    const handleDeleteImage = async () => {
        const imageToDelete = editedQuestion.imgpregunta[currentImageIndex]; // Obtener la imagen visible actualmente
        const idImg = imageToDelete.idImg; // Obtener el id de la imagen

        const response = await fetch(`${apiUrl}/question/img/delete/${idImg}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const updatedImages = [...editedQuestion.imgpregunta.filter((img, index) => index !== currentImageIndex)];


            setEditedQuestion({
                ...editedQuestion,
                imgpregunta: updatedImages,
            });

            if (currentImageIndex >= updatedImages.length) {
                setCurrentImageIndex(updatedImages.length - 1); // Ajustar el índice si es necesario
            }

            toast.success("Imagen eliminada", {
                position: "top-right"
            });
            updateQuestions(); // Actualizar preguntas en el padre

        } else {
            toast.warning("No se pudo eliminar la imagen", {
                position: "top-right"
            });
        }
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
            toast.success("Pregunta actualizada con éxito", {
                position: "top-right"
            });
            updateQuestions();
            setIsOpen(false); // Cerrar el modal
        } else {
            toast.error("Hubo un error al guardar los cambios", {
                position: "top-right"
            });
        }
    };

    // Función para cancelar y cerrar el modal sin hacer cambios
    const handleCancel = () => {
        setIsOpen(false); // Cerrar el modal sin guardar cambios
    };

    // Función para cambiar la imagen actual hacia la izquierda
    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? editedQuestion.imgpregunta.length - 1 : prevIndex - 1));
    };

    // Función para cambiar la imagen actual hacia la derecha
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === editedQuestion.imgpregunta.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && setIsOpen(false)}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                <DialogContent
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll"
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

                    {/* Carrusel de imágenes con navegación */}
                    {editedQuestion.imgpregunta && editedQuestion.imgpregunta.length > 0 && (
                        <div className="relative">
                            <div className="w-full flex justify-center items-center">
                                <img
                                    src={editedQuestion.imgpregunta[currentImageIndex].img}
                                    alt="Imagen de la pregunta"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>

                            {/* Botones de navegación */}
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

                            {/* Botón para eliminar la imagen */}
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

                    {/* Subir nueva imagen */}
                    <div className="mt-4">
                        <label htmlFor="file" className="text-gray-700 font-medium">Subir Imagen:</label>
                        <input
                            type="file"
                            id="file"
                            accept="image/*"
                            className="my-2"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded">Cancelar</button>
                        <button onClick={handleSaveChanges} className="bg-blue-500 text-white py-2 px-4 rounded">Guardar Cambios</button>
                        <button onClick={handleAddImage} className="bg-green-500 text-white py-2 px-4 rounded">Añadir Imagen</button>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default EditQuestion;
