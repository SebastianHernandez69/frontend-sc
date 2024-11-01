"use client"

import { getCategories } from "../../home.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

interface Categoria{
    idCategoria: number,
    categoria: string,
    imgCategoria: string
}

interface Materia {
    idMateria: number;
    idCategoria: number;
    materia: string;
}

interface Pregunta{
    idMateria: number,
    titulo: string,
    descripcion: string,
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function FormQuestion(){

    const [categories, setCategories] = useState<Categoria[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedMateria, setSelectedMateria] = useState<number | null>(null);

    const router = useRouter();
    //manejar envio de pregunta
    const {register, handleSubmit, reset} = useForm<Pregunta>();
    const [files, setFiles] = useState<File[]>([]);

    // Llenar las categorias
    useEffect(()=>{
        const fetchCategorias =async () => {
            try {
                const data: Categoria[] = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error al obtener categorias:", error);
            }
        }
        fetchCategorias();
    }, [])

    // Llenar las materias
    useEffect(() => {
        if(selectedCategory !== null){
            fetch(`http://localhost:3000/categories/materia/${selectedCategory}`)
                .then(response => response.json())
                .then((data: Materia[]) => setMaterias(data))
                .catch(error => console.error('Error al cargar las materias:', error));
        } else {
            setMaterias([]);
        }
    },[selectedCategory]);

    // Manejar el cambio de archivos
    const handleFileChange = (e: any) => {
        setFiles(Array.from(e.target.files));
    }
    
    // Enviar pregunta al servidor
    const onSubmit:SubmitHandler<Pregunta> = async (data) => {
        const formData = new FormData();
        const defaultQuestionState:number = 1;

        formData.append("titulo",data.titulo);
        formData.append("descripcion",data.descripcion);
        formData.append("idMateria", data.idMateria.toString());
        formData.append("idEstadoPregunta",defaultQuestionState.toString());

        files.map(file => {
            formData.append("files", file);
        });
        console.log("Contenido de FormData:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        //JWT
        const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksInVzZXJuYW1lIjo5LCJyb2wiOjIsImlhdCI6MTczMDQzMjg4NywiZXhwIjoxNzMwNDM2NDg3fQ.hrlOrJ2YRlYvVy81mvNGvL0a8jRDGLHuabj51YpawW4";

        try {
            const res = await fetch(`${apiUrl}/user/pregunta/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.text(); 
                console.error("Error del servidor:", errorData);
            }
            // const resData = await res.json();
            // console.log("Respuesta: ",resData);
            
            router.push('/');
            router.refresh();

            reset();
            setFiles([]);
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="categorySelect" className="text-gray-700 font-medium">
                        Seleccione una categoria
                    </label>

                    <select 
                        id="cbCategories"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCategory ?? ''}
                        onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
                    >
                        {
                            categories.map(category => (
                                <option value={category.idCategoria} key={category.idCategoria}>
                                    {category.categoria}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Materias */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="materiaSelect" className="text-gray-700 font-medium">
                        Selecciona una materia:
                    </label>

                    <select
                        id="MateriaSelect"
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedMateria ?? ''}
                        //onChange={(e) => setSelectedMateria(Number(e.target.value) || null)}
                        disabled = {!selectedCategory}
                        {...register("idMateria" , {required: true})}
                    >
                        {
                            materias.map(materia => (
                                <option key={materia.idMateria} value={materia.idMateria}>
                                    {materia.materia}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label 
                        htmlFor="lblTitulo" className="text-gray-700 font-medium"
                    >
                        Titulo:
                    </label>
                    <Input className="my-2"
                        {...register("titulo", {required: true})}
                    ></Input>

                    <label htmlFor="lblDescripcion" className="text-gray-700 font-medium">Descripcion:</label>
                    <Input className="my-2"
                        {...register("descripcion", {required: true})}
                    ></Input>

                    <label htmlFor="lblImages" className="text-gray-700 font-medium">Imagenes(opcional):</label>
                    <Input 
                        type="file" 
                        id="file" 
                        accept="images/*" 
                        multiple className="my-2"
                        onChange={handleFileChange}
                    ></Input>
                </div>
                <Button type={"submit"}>Enviar</Button>
            </form>
        </>
    )
}