import { MateriaProvider } from "@/context/MateriaTutorContext";
import React from "react";

export default function ProfileLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <MateriaProvider>
                <main>
                    {children}
                </main>
            </MateriaProvider>  
        </>
    )
}