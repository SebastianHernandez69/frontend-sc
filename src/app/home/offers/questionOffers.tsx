import React from 'react';
import FormOferta from './formOffer';
import OfferCard from './card-oferta';
import { Offer } from '../interfaces/oferta';

interface QuestionOffersProps {
    userData: { rol: number } | null;
    selectedQuestion: {
        idPregunta: number;
        idUsuarioPupilo: number;
        ofertaresolucion?: Offer[];
    } | null;
    updateQuestions: () => void;
}

interface OfferSectionProps {
    title: string;
    offers: Offer[];
    idPupilo: number;
}

const OfferSection: React.FC<OfferSectionProps> = ({ title, offers, idPupilo }) => (
    <>
        <p className="text-md font-semibold text-center">{title}</p>
        <div className="w-full border my-2"></div>
        <div className='flex'>
            <div className='w-full'>
                {offers.map((oferta) => (
                    <OfferCard 
                        key={oferta.idOferta}
                        offer={oferta}
                        idUsuarioPupilo={idPupilo}
                    />
                ))}
            </div>
        </div>
    </>
);

const QuestionOffers: React.FC<QuestionOffersProps> = ({ userData, selectedQuestion, updateQuestions }) => {
    const offers = selectedQuestion?.ofertaresolucion ?? [];
    const hasOffers = offers.length > 0;

    return (
        <>
            {userData?.rol === 2 && hasOffers && (
                <OfferSection title="Ofertas de solución" offers={offers} idPupilo={selectedQuestion.idUsuarioPupilo}/>
            )}
            {userData?.rol === 1 && hasOffers && (
                <OfferSection title="Tu oferta" offers={offers} idPupilo={selectedQuestion.idUsuarioPupilo} />
            )}
            {userData?.rol === 1 && !hasOffers && (
                <>
                    <p className="text-md font-semibold text-center">Realizar oferta</p>
                    <div className="w-full border my-2"></div>
                    <FormOferta idPregunta={selectedQuestion?.idPregunta} updateQuestions={updateQuestions}/>
                </>
            )}
        </>
    );
};

export default QuestionOffers;
