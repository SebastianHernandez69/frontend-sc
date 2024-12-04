"use client";

import React, { createContext, useEffect, useContext, useState, ReactNode } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Materia {
    idMateria: number;
    materia: string;
}

interface MateriaContextType {
    materiasTutor: Materia[] | null;
    loading: boolean;
    addMateriaTutor: (newMateria: Materia) => void;
    removeMateriaTutor: (idMateria: number) => void;  // Añadimos esta función
}

const MateriaContext = createContext<MateriaContextType | undefined>(undefined);

interface MateriaProviderProps {
    children: ReactNode;
}

export const MateriaProvider = ({ children }: MateriaProviderProps) => {
    const [materiasTutor, setMaterias] = useState<Materia[] | null>(null);
    const [loading, setLoading] = useState(true);

    // Función para agregar una materia
    const addMateriaTutor = (newMateria: Materia) => {
        if (materiasTutor) {
            setMaterias([...materiasTutor, newMateria]);
        }
    };

    // Función para eliminar una materia
    const removeMateriaTutor = (idMateria: number) => {
        if (materiasTutor) {
            setMaterias(materiasTutor.filter((materia) => materia.idMateria !== idMateria));
        }
    };

    // Función para obtener las materias del tutor
    const fetchMaterias = async () => {
        const access_token = sessionStorage.getItem("access_token");

        if (!access_token) {
            throw new Error(`No token`);
        }

        try {
            const res = await fetch(`${apiUrl}/materia/interes-tutor`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Error al obtener materias del usuario: ${res.status}`);
            }

            const data = await res.json();
            setMaterias(data || []);
        } catch (error) {
            console.error(`Error al obtener materias del usuario: ${error}`);
            setMaterias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!materiasTutor || loading) {
            fetchMaterias();
        }
    }, [materiasTutor, loading]);

    return (
        <MateriaContext.Provider value={{ materiasTutor, loading, addMateriaTutor, removeMateriaTutor }}>
            {children}
        </MateriaContext.Provider>
    );
};

// Hook para acceder al contexto
export const useMateriaContext = (): MateriaContextType => {
    const context = useContext(MateriaContext);

    if (!context) {
        throw new Error("useMateriaContext debe usarse dentro de un MateriaProvider");
    }

    return context;
};
