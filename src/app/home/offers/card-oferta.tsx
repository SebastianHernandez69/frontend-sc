import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Offer } from '../interfaces/oferta';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';

type CompleteOfferCardProp = {
    offer: Offer
}

const OfferCard: React.FC<CompleteOfferCardProp> = ({offer}) => {

    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOfferClick = (offer: any) => {
        setSelectedOffer(offer);
        setIsOpen(true);
    }
    useEffect(() => {
        if (selectedOffer) {
            console.log("Oferta seleccionada:", selectedOffer);
        }
    }, [selectedOffer]);

    return (
        <>
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
                                <DialogTitle className="text-sm font-bold text-center">
                                    Detalles de la oferta
                                </DialogTitle>
                                <DialogDescription></DialogDescription>
                                

                            </DialogHeader>
                        </DialogContent>
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>

        </>
    );
};

export default OfferCard;