import { ExperienceProvider } from "@/context/ExperienciaContext";
import { MateriaProvider } from "@/context/MateriaTutorContext";
import React from "react";

export default function ProfileLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ExperienceProvider>
                <MateriaProvider>
                    <main>
                        {children}
                    </main>
                </MateriaProvider>  
            </ExperienceProvider>
        </>
    )
}