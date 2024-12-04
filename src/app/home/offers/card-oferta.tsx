import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Offer } from '../interfaces/oferta';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { userPayload } from '../interfaces/userPayload-int';
import { jwtDecode } from 'jwt-decode';
import RouteGuard from '@/components/routeGuard';
import { toast } from 'react-toastify';

type CompleteOfferCardProp = {
    offer: Offer;
    idUsuarioPupilo: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const OfferCard: React.FC<CompleteOfferCardProp> = ({offer, idUsuarioPupilo}) => {

    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState<userPayload | null> (null)
    const router = useRouter();
    const access_token = sessionStorage.getItem("access_token");

    const handleProfileClick = (idTutor: number) => {
        router.push(`/home/profile/profile-guest?tutor=${idTutor}`)
    }

    const handleOfferClick = (offer: Offer) => {
        setSelectedOffer(offer);
        setIsOpen(true);
    }

    const handleAcceptOffer = async (idOferta: number) => {
        try {
            const res = await fetch(`${apiUrl}/user/pregunta/aceptar-oferta`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({idOferta})
            });

            if(!res.ok){
                console.log("error al actualizar estado de la oferta");
            } else {
                console.log("Estado de la pregunta actualizado correctamente");
                setIsOpen(false);
            }

        } catch (error) {
            console.error(`Error handleAcceptOffer ${error}`);
        }
    }

    // Answere question
    const handleAnswerQuestion = async (idPregunta: number, idPupilo: number) => {
        try {

            console.log(`ID del pupilo que pregunta: ${idPupilo}`);

            const data = {
                idPregunta: idPregunta
            }

            const res = await fetch(`${apiUrl}/question/answere-question`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify(data)
            });

            if(!res.ok){
                console.error(`Error al cambiar estado de la pregunta`);
            }

            toast.success("Pregunta marcada como contestada", {
                position: "top-right"
            });
            setIsOpen(false);
            return;
        } catch (error) {
            console.error(`Error al contestar la pregunta: ${error}`);
        }
    }

    useEffect(() => {
        if (access_token) {
            const decoded = jwtDecode<userPayload>(access_token);
            setUserData(decoded);
        } else {
            setUserData(null);
        }
    }, [access_token]);

    const handleCreateConversation = async (idUsuario: number, idUsuarioTutor: number) => {
        const data = {
            userId1: idUsuario.toString(),
            userId2: idUsuarioTutor.toString()
        }

        const res = await fetch(`${apiUrl}/streamchat/channel/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if(!res.ok){
            console.error('Error al obtener o crear channel');
        }

        const resData = await res.json();

        router.push(`/home/chat?channel=${encodeURIComponent(resData.id)}`);
    }

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= offer.usuario.valoracion; i++) {
          stars.push(
            <span key={i} className={`text-${i <= offer.usuario.valoracion ? "yellow" : "gray"}-500`}>
              ★
            </span>
          );
        }
        return stars;
    };

    return (
        <>
            <RouteGuard>
                <div key={offer.idOferta} onClick={() => handleOfferClick(offer)} className="flex items-center border-b border-gray-300 p-3 w-full">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14  ">
                        <img src={offer.usuario.fotoPerfil} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="ml-3 flex flex-col justify-center ">
                        <p className="font-semibold text-md">{`${offer.usuario.nombre.primerNombre} ${offer.usuario.nombre.primerApellido}`}</p>
                        <p className="font-light text-gray-600 text-sm line-clamp-1 overflow-hidden">
                            {offer.descripcion}
                        </p>
                        <p className="font-light text-gray-600 text-sm">
                            {new Date(offer.fechaOferta).toLocaleString()}
                        </p>
                    </div>
                    <div className='ml-auto'>
                    </div>
                </div>
            
                {/* DIALOG OFERTA */}

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogPortal>
                        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50">
                            <DialogContent
                                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 
                                    max-w-96 rounded-xl sm:max-w-[100vh]  w-full
                                    outline-none max-h-[90vh] sm:max-h-[85vh] overflow-y-scroll
                                }`}
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-md font-bold text-center">
                                        Detalles de la oferta
                                    </DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center border-t border-gray-300 p-3 w-full">
                                    <div onClick={() => handleProfileClick(offer.usuario.idUsuario)} className="flex-shrink-0 w-[12vh] h-[12vh] sm:w-[20vh] sm:h-[20vh]">
                                        <img src={selectedOffer?.usuario.fotoPerfil} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className="flex flex-col ml-3 justify-center w-full">
                                        <p className="font-semibold text-md text-center">{`${offer.usuario.nombre.primerNombre} ${offer.usuario.nombre.primerApellido}`}</p>
                                        <p className="font-ligth text-sm text-center">{offer.usuario.correo}</p>
                                        <div className="flex justify-center space-x-1 mt-2">{renderStars()}</div> 
                                    </div>
                                </div>
                                <div className="flex flex-col my-5 justify-center w-full">
                                    <p className="font-ligth text-sm text-center">{offer.descripcion}</p>
                                </div>
                                <div className='border my-3'>
                                </div>
                                <div className="flex mt-2 text-xs justify-between justify-center w-full">
                                    <p className=''>
                                        {new Date(offer.fechaOferta).toLocaleString()}
                                    </p>
                                    <p>
                                        {offer.estadoOfertaSolucion?.estadoOferta}
                                    </p>
                                </div>
                                <div className='border my-3'>
                                </div>
                                {userData?.rol == 2 && (
                                    <div className='flex w-full justify-between'>
                                        <Button onClick={() => handleCreateConversation(userData.sub, offer.usuario.idUsuario)}>Enviar mensaje</Button>
                                        {offer.estadoOfertaSolucion?.idEstadoOferta === 1 && (
                                            <Button onClick={() => handleAcceptOffer(offer.idOferta)}>Aceptar</Button>
                                        )}
                                    </div>
                                )}
                                {userData?.rol === 1 && offer.estadoOfertaSolucion.idEstadoOferta === 3 && (
                                    <div className='flex w-full justify-center'>
                                        <Button onClick={() => handleAnswerQuestion(offer.idPregunta, idUsuarioPupilo)}>
                                            Marcar como contestada
                                        </Button>
                                    </div>
                                )}
                            </DialogContent>
                        </DialogOverlay>
                    </DialogPortal>
                </Dialog>
            </RouteGuard>
        </>
    );
};

export default OfferCard;