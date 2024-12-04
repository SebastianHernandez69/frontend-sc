"use client"

import RouteGuard from "@/components/routeGuard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnsweredQuestionList from "./answeredQuestionList";

export default function AnsQuestionPage(){
    return (
        <>
            <RouteGuard>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-center">
                            Preguntas contestadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AnsweredQuestionList />
                    </CardContent>
                </Card>

            </RouteGuard>
        </>
    )
}