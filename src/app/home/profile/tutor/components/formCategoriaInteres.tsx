"use client";

import { useEffect, useState } from "react";
import { Categoria, Materia, MateriaTutor } from "../../../interfaces/categories";
import { getCategories } from "../../../home.api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useMateriaContext } from "@/context/MateriaTutorContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormCategoriaMateria() {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedMateria, setSelectedMateria] = useState<number | null>(null);
    const { register, handleSubmit, reset } = useForm<MateriaTutor>();
    const { addMateriaTutor, removeMateriaTutor, materiasTutor } = useMateriaContext();

    const alertAddMateriaSuccess = () => {
        toast.success("Materia agregada con éxito", {
            position: "top-right"
        });
    };

    const alertExistMateria = () => {
        toast.error("La materia ya está en tu lista de interés", {
            position: "top-right"
        });
    };

    const alertDeleteMateriaSuccess = () => {
        toast.success("Materia eliminada con éxito", {
            position: "top-right"
        });
    };

    const alertDeleteMateriaError = () => {
        toast.error("Error al eliminar la materia", {
            position: "top-right"
        });
    };

    // Llenar las categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data: Categoria[] = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };
        fetchCategorias();
    }, []);

    // Llenar las materias según la categoría seleccionada
    useEffect(() => {
        if (selectedCategory !== null) {
            fetch(`${apiUrl}/categories/materia/${selectedCategory}`)
                .then((response) => response.json())
                .then((data: Materia[]) => setMaterias(data))
                .catch((error) => console.error("Error al cargar las materias:", error));
        } else {
            setMaterias([]);
        }
    }, [selectedCategory]);

    // Enviar el interés del tutor al servidor
    const onSubmit: SubmitHandler<MateriaTutor> = async (data) => {
        const materiaInteres = {
            idMateria: data.idMateria,
        };

        const access_token = sessionStorage.getItem("access_token");

        if (!access_token) {
            console.error("Token de autenticación no encontrado.");
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/user/materia-interes/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(materiaInteres),
            });

            if (res.status === 409) {
                alertExistMateria();
                return;
            }

            if (!res.ok) {
                console.error(res.text());
            }

            const data = await res.json();

            addMateriaTutor(data);
            alertAddMateriaSuccess();
            handleReset();
            reset();
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    // Función para eliminar la materia
    const handleDeleteMateria = async (idMateria: number) => {
        const access_token = sessionStorage.getItem("access_token");

        if (!access_token) {
            console.error("Token de autenticación no encontrado.");
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/materia/interes-tutor/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ idMateria }),
            });

            if (!res.ok) {
                alertDeleteMateriaError();
                return;
            }

            // Si la eliminación fue exitosa, actualizamos el contexto o el estado
            removeMateriaTutor(idMateria);
            alertDeleteMateriaSuccess();
        } catch (error) {
            console.error("Error al eliminar la materia:", error);
            alertDeleteMateriaError();
        }
    };

    // Resetear los valores seleccionados
    const handleReset = () => {
        setSelectedCategory(null);
        setSelectedMateria(null);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="categorySelect" className="text-gray-700 font-medium">
                        Seleccione una categoría
                    </label>

                    <select
                        id="cbCategories"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCategory ?? ""}
                        onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                            <option value={category.idCategoria} key={category.idCategoria}>
                                {category.categoria}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selección de materia */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="materiaSelect" className="text-gray-700 font-medium">
                        Selecciona una materia:
                    </label>

                    <select
                        id="MateriaSelect"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedMateria ?? ""}
                        disabled={!selectedCategory}
                        {...register("idMateria", {
                            required: true,
                            onChange: (e) => {
                                const value = Number(e.target.value) || null;
                                setSelectedMateria(value);
                            },
                        })}
                    >
                        <option value="">Seleccionar materia</option>
                        {materias.map((materia) => (
                            <option key={materia.idMateria + 100} value={materia.idMateria}>
                                {materia.materia}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type={"submit"}>Agregar materia</Button>
            </form>

            {/* Mostrar las materias seleccionadas para eliminar */}
            {materiasTutor.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold">Mis Materias Seleccionadas</h3>
                    <ul className="space-y-4">
                        {materiasTutor.map((materia) => (
                            <li key={materia.idMateria} className="flex justify-between items-center">
                                <span>{materia.materia}</span>
                                <Button
                                    onClick={() => handleDeleteMateria(materia.idMateria)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Eliminar
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}
