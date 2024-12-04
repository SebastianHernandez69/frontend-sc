"use client"

import { Conocimiento, Experience } from "@/app/home/interfaces/experience"
import { useExperience } from "@/hooks/useExperience";
import { createContext, ReactNode, useContext } from "react";

interface ExperienciaContextType{
    experiencias: Experience[] | null;
    conocimientos: Conocimiento[] | null;
    loading: boolean;
    addConocimientoTutor: (newConocimiento: Conocimiento) => void;
    addExperienciaTutor: (newExperiencia: Experience) => void;
}

const ExperienciaContext = createContext<ExperienciaContextType | undefined>(undefined);

interface ExperienceProviderProps{
    children: ReactNode;
}

export const ExperienceProvider = ({children}: ExperienceProviderProps) => {
    const { experiencias, conocimientos, loading, setConocimientos, setExperiencias } = useExperience();

    // aagregar conocimiento
    const addConocimientoTutor = (newConocimiento: Conocimiento) => {
        if(conocimientos){
            setConocimientos([...conocimientos, newConocimiento]);
        }
    }

    const addExperienciaTutor = (newExperiencia: Experience) => {
        if(experiencias){
            setExperiencias([...experiencias, newExperiencia])
        }
    }

    return (
        <>
            <ExperienciaContext.Provider value={{experiencias, conocimientos, loading, addConocimientoTutor, addExperienciaTutor}}>
                {children}
            </ExperienciaContext.Provider>
        </>
    )
}

// hook para acceder al contexto
export const useExperienceContext = (): ExperienciaContextType => {
    const context = useContext(ExperienciaContext);

    if(!context){
        throw new Error("useExperienceContext debe usarse dentro de un ExperienceProvider");
    }

    return context;
}