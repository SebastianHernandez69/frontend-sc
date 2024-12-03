"use client"

import { useEffect, useState } from "react"
import { AnsweredQuestion } from "../interfaces/question-interface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { userPayload } from "../interfaces/userPayload-int";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AnsweredQuestionList = () => {

    const [ansQuestions, setAnsQuestions] = useState<AnsweredQuestion[] | null>(null);
    const [userData, setUserData] = useState<userPayload | null>(null);

    useEffect(() =>{

        const access_token = sessionStorage.getItem("access_token");

        if(!access_token){
            console.log('No token en ansQuestionList');
            return;
        }

        const tokenData:userPayload = jwtDecode(access_token);

        setUserData(tokenData);

        try {
            const fetchAnsQuestions = async () => {
                const res = await fetch(`${apiUrl}/question/answer-question/get`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
    
                if(!res.ok){
                    console.error("Error al obtener las preguntas contestadas");
                }
    
                const data: AnsweredQuestion[] = await res.json();
                setAnsQuestions(data);
            }

            fetchAnsQuestions();
        } catch (error) {
            console.error(`Error al obtener valoracion: ${error}`);
        }
    }, [])

    return (
        <>
            <Table>
                <TableHeader className="bg-gray-100 text-left">
                    <TableRow className="border-b">
                    <TableHead className="px-4 py-2 font-semibold text-gray-700">Titulo</TableHead>
                    <TableHead className="px-4 py-2 font-semibold text-gray-700">Descripcion</TableHead>
                    <TableHead className="px-4 py-2 font-semibold text-gray-700">Materia</TableHead>
                    <TableHead className="px-4 py-2 font-semibold text-gray-700">Fecha</TableHead>
                    {userData && userData.rol === 2 && (
                        <TableHead className="px-4 py-2 font-semibold text-gray-700">Tutor</TableHead>
                    )}
                    {userData && userData.rol === 1 && (
                        <TableHead className="px-4 py-2 font-semibold text-gray-700">Pupilo</TableHead>
                    )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ansQuestions?.map((question, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{question.titulo}</TableCell>
                            <TableCell>{question.descripcion}</TableCell>
                            <TableCell>{question.materia}</TableCell>
                            <TableCell>{format(question.fechaContestada, "dd/MM/yyyy")}</TableCell>
                            <TableCell>{question.nombre.primerNombre} {question.nombre.primerApellido}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    )
}

export default AnsweredQuestionList;