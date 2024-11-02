import React from 'react';
import FormOferta from './formOffer';
import OfferCard from './card-oferta';

// Define las interfaces para los datos de usuario y oferta
interface Usuario {
    idUsuario: number;
    fotoPerfil: string;
    nombre: {
        primerNombre: string;
        primerApellido: string;
    };
}

interface Oferta {
    idOferta: number;
    descripcion: string;
    fechaOferta: string;
    usuario: Usuario;
}

interface QuestionOffersProps {
    userData: { rol: number } | null;
    selectedQuestion: {
        idPregunta: number;
        ofertaresolucion?: Oferta[];
    } | null;
    updateQuestions: () => void;
}

interface OfferSectionProps {
    title: string;
    offers: Oferta[];
}

const OfferSection: React.FC<OfferSectionProps> = ({ title, offers }) => (
    <>
        <p className="text-md font-semibold text-center">{title}</p>
        <div className="w-full border my-2"></div>
        <div className='flex'>
            <div className='w-full'>
                {offers.map((oferta) => (
                    <OfferCard 
                        key={oferta.idOferta} 
                        idOferta={oferta.idOferta}
                        imgTutor={oferta.usuario.fotoPerfil}
                        name={`${oferta.usuario.nombre.primerNombre} ${oferta.usuario.nombre.primerApellido}`}
                        description={oferta.descripcion}
                        fechaOferta={oferta.fechaOferta}
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
                <OfferSection title="Ofertas de solución" offers={offers} />
            )}
            {userData?.rol === 1 && hasOffers && (
                <OfferSection title="Tu oferta" offers={offers} />
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
