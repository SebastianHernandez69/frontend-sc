import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const EditQuestion = ({ question, updateQuestions, setIsOpen }) => {
    const [editedQuestion, setEditedQuestion] = useState(question);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]); // Imágenes seleccionadas para previsualización
    const [localCarouselKey, setLocalCarouselKey] = useState(Date.now()); // Clave única para este carrusel

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Asegurarse de que cada archivo sea un objeto de tipo File
        const previews = files.map((file) => {
            if (file instanceof File) {
                return {
                    file,
                    preview: URL.createObjectURL(file),
                };
            } else {
                // Manejar el caso si el archivo no es válido (aunque no debería pasar)
                console.error("El archivo no es de tipo File:", file);
                return null;
            }
        }).filter(preview => preview !== null); // Filtrar los nulos, por si acaso
    
        setSelectedFiles((prevFiles) => [...prevFiles, ...previews]); // Agregar las nuevas imágenes seleccionadas
    };
    

    const handleRemovePreview = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Eliminar la imagen seleccionada
    };
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

            setLocalCarouselKey(Date.now()); // Forzar el re-renderizado del carrusel local

            toast.success("Imagen eliminada", {
                position: "top-right",
            });
            updateQuestions(); // Actualizar preguntas en el componente padre
        } else {
            toast.warning("No se pudo eliminar la imagen", {
                position: "top-right",
            });
        }
    };
    const handleSaveChanges = async () => {
        const formData = new FormData();

        // Agregar datos generales
        formData.append("titulo", editedQuestion.titulo);
        formData.append("descripcion", editedQuestion.descripcion);

        // Agregar las imágenes seleccionadas
        selectedFiles.forEach(({ file }) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch(`${apiUrl}/question/update/${editedQuestion.idPregunta}`, {
                method: 'PATCH',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();

                if (!data.imgpregunta || !Array.isArray(data.imgpregunta)) {
                    throw new Error("La respuesta del servidor no contiene imágenes actualizadas.");
                }

                setEditedQuestion((prevState) => ({
                    ...prevState,
                    imgpregunta: data.imgpregunta,
                }));

                setCurrentImageIndex(data.imgpregunta.length - 1);
                toast.success("Pregunta actualizada con éxito", { position: "top-right" });

                updateQuestions();
                setSelectedFiles([]); // Limpiar las imágenes seleccionadas
                setIsOpen(false);
            } else if(response.status === 409){
                toast.error(`No se puede editar, pregunta ya aceptada o contestada`);
            } else {
                toast.error(`Error al actualizar la pregunta`);
            }
        } catch (error) {
            console.error(`Error al actualizar la pregunta: ${error}`);
        }
    };

    const handleCancel = () => {
        setIsOpen(false); // Cerrar el modal sin guardar cambios
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? editedQuestion.imgpregunta.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === editedQuestion.imgpregunta.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && setIsOpen(false)}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-center">Editar Pregunta</DialogTitle>
                    </DialogHeader>
                    <div className="w-full border my-2"></div>

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

                    {editedQuestion.imgpregunta && editedQuestion.imgpregunta.length > 0 && (
                        <div className="relative" key={localCarouselKey}>
                            <div className="w-full flex justify-center items-center">
                                <img
                                    src={editedQuestion.imgpregunta[currentImageIndex]?.img || ""}
                                    alt="Imagen de la pregunta"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>
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

                    {/* Vista previa de imágenes seleccionadas */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                            <label className="block text-gray-700 font-medium">Imágenes seleccionadas:</label>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={file.preview}
                                            alt={`Preview ${index}`}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <button
                                            onClick={() => handleRemovePreview(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-700"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <Input
                            type="file"
                            id="file"
                            accept="image/*"
                            multiple
                            className="my-2"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded">Cancelar</button>
                        <button onClick={handleSaveChanges} className="bg-blue-500 text-white py-2 px-4 rounded">Guardar Cambios</button>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default EditQuestion;
