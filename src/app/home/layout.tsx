import React from "react";
import Navbar from "@/components/navBar";

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>){
    return(
        <>    
            <Navbar></Navbar>
            <main>{children}</main>
        </>
    )
}