"use client"

import React, { createContext, useEffect, useContext, useState, ReactNode } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface MateriaContextType{
    materias: string[] | null;
    loading: boolean,
    addMateriaTutor: (newMateria: string) => void;
}

const MateriaContext = createContext<MateriaContextType | undefined>(undefined);

interface MateriaProviderProps {
    children: ReactNode;
}

export const MateriaProvider = ({children}: MateriaProviderProps) => {
    const [materias, setMaterias] = useState<string[] | null> (null);
    const [loading, setLoading] = useState(true);

    const addMateriaTutor = (newMateria: string) => {
        if(materias){
            setMaterias([...materias, newMateria])
        }
    }

    const fetchMaterias = async () => {
        const access_token = sessionStorage.getItem("access_token");

        if(!access_token){
            throw new Error(`No token`)
        }

        try {
            const res = await fetch(`${apiUrl}/materia/interes-tutor`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                }
            });

            if(!res.ok){
                throw new Error(`Error al obtener materias del usuario: ${res.status}`);
            }

            const data = await res.json();
            setMaterias(data?.materias || []);
        } catch (error) {
            console.error(`Error al obtener materias del usuario: ${error}`);
            setMaterias([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!materias || loading){
            fetchMaterias();
        }
    }, [materias, loading]);

    return (
        <>
            <MateriaContext.Provider value={{materias, loading, addMateriaTutor}}>
                {children}
            </MateriaContext.Provider>
        </>
    )

}

// Hook para acceder al contexto
export const useMateriaContext = (): MateriaContextType => {
    const context = useContext(MateriaContext);

    if(!context) {
        throw new Error("useUserContext debe usarse dentro de un MateriaProvider");
    }

    return context;
}