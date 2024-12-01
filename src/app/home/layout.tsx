"use client"

import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import Header from "@/components/sidebar/header";
import HeaderMobile from "@/components/sidebar/header-mobile";
import SideNav from "@/components/sidebar/side-nav";
import PageWrapper from "@/components/sidebar/page-wrapper";
import MarginWidthWrapper from "@/components/sidebar/margin-width-wrapper";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/UserContext";
import { userPayload } from "./interfaces/userPayload-int";
import { jwtDecode } from "jwt-decode";
import FormValoracion from "@/components/formValoracion";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [idTutor, setIdTutor] = useState<number | null>(null);

    useEffect(() => {
        const socket = io(`${apiUrl}`, { transports: ['websocket'] });
        const token = sessionStorage.getItem('access_token');
        let userData: userPayload = null;
        
        if(token){
            userData = jwtDecode(token);
        }

        if(userData){
            socket.emit('registerUser', {idUsuario: userData.sub});
            console.log(`Usuario registrado con id ${userData.sub}`);

            // unirse a la room
            const handleJoinRoom = ({idPregunta}) => {
                socket.emit('joinRoomAnswerQuestion', {idPregunta});
                console.log(`Usuario con ID ${userData.sub} se unió a la room ${idPregunta}`);
            }

            socket.on('joinRoomAnswerQuestion', handleJoinRoom);

            let handleAnsweredQuestion = null;
            if(userData.rol === 2){
                handleAnsweredQuestion = ({idPregunta, idTutor}) => {
                    console.log(`Pregunta ${idPregunta} contestada por el tutor: ${idTutor}`);
                    setIdTutor(idTutor);
                    setIsDialogOpen(true);
                };

                socket.on('questionAnswered', handleAnsweredQuestion);
            }

            return () => {
                socket.off('joinRoomAnswerQuestion', handleJoinRoom);
                if(handleAnsweredQuestion){
                    socket.off('questionAnswered', handleAnsweredQuestion);
                }
            }
        }

    }, []);

    return (
        <>   
            <UserProvider>
                <div className="flex">
                    <SideNav />
                    <main className="flex-1">
                        <MarginWidthWrapper>
                            <Header/>
                            <HeaderMobile/>
                            <PageWrapper>
                                {children}
                            </PageWrapper>
                        </MarginWidthWrapper>
                    </main>
                </div>    
            </UserProvider>

            {
                isDialogOpen && (
                    <FormValoracion
                        idTutor={idTutor}
                        onClose={() => setIsDialogOpen(false)}
                    >

                    </FormValoracion>
                )
            }
        </>
    );
}

    
    