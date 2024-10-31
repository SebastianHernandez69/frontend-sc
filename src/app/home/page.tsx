"use client"

import { useEffect, useState } from "react";
import { getQuestionsPupilo } from "./home.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import Carousel from "@/components/ui/carousel";

interface Question{
    idPregunta: number;
    idUsuarioPupilo: number;
    titulo: string;
    descripcion: string;
    fechaPublicacion: any;
    materia: {
        materia: string
    };
    imgpregunta:{
        img: string
    }[];
}

export default function homePage(){
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);;

    //
    useEffect(() => {
        const fetchQuestions = async () => {
          try {
            const data: Question[] = await getQuestionsPupilo();
            setQuestions(data);
          } catch (error) {
            console.error("Error al obtener preguntas:", error);
          }
        };
    
        fetchQuestions();
    }, []);

    const handleCardClick = (question: any) => {
        setSelectedQuestion(question);
        setIsOpen(true);
    }

    return (
        <>
            <div className="flex justify-center p-4 text-2xl">TUS PREGUNTAS</div>
            {/* CARD */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
        
            {questions.length > 0 ? (
            questions.map((question) => (
                <Card key={question.idPregunta} onClick={() => handleCardClick(question)} className="m-2 overflow-hidden shadow cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            {question.titulo}
                            <span className="text-xs">{question.materia.materia}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="line-clamp-3 overflow-hidden">
                            {question.descripcion}
                        </p>
                        <p className="pt-3">{new Date(question.fechaPublicacion).toLocaleString()}</p>
                    </CardContent>
                </Card>
            ))
            ) : (
                <div key="no-questions" className="text-center p-4">No hay preguntas disponibles</div>
            )}

            {/* DIALOG DETAIL */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <DialogContent
                        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 max-w-[80vh] rounded-xl sm:max-w-2xl w-full
                            outline-none max-h-[90vh] sm:max-h-[90vh] overflow-y-scroll
                        }`}
                        >
                        <DialogHeader>
                            <DialogTitle className="font-bold">{selectedQuestion?.titulo}</DialogTitle>
                                <div className="w-full border"></div>
                            <DialogDescription className="text-justify">{selectedQuestion?.descripcion}</DialogDescription>
                        </DialogHeader>
                        <div className="w-full border my-2"></div>
                        {/* Carrusel de imágenes */}
                        {selectedQuestion?.imgpregunta && selectedQuestion.imgpregunta.length > 0 && (
                            <Carousel images={selectedQuestion.imgpregunta.map(img => img.img)} />
                        )}
                        <p className="text-sm mt-2">
                            Materia: {selectedQuestion?.materia.materia}
                        </p>
                        <p className="text-sm">
                            Fecha de publicación: {new Date(selectedQuestion?.fechaPublicacion).toLocaleString()}
                        </p>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>

        </>
    )
}