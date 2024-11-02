import { Button } from '@/components/ui/button';
import React from 'react';

type OfferCardProps = {
    idOferta: number;
    imgTutor: string;
    name: string;
    description: string;
    fechaOferta: any;
};

const OfferCard: React.FC<OfferCardProps> = ({idOferta,imgTutor,description,name,fechaOferta}) => {
  return (
    <div key={idOferta} className="flex items-center border-b border-gray-300 p-3 w-full">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14  ">
            <img src={imgTutor} className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="ml-3 flex flex-col justify-center ">
            <p className="font-semibold text-md">{name}</p>
            <p className="font-light text-gray-600 text-sm line-clamp-1 overflow-hidden">
                {description}
            </p>
            <p className="font-light text-gray-600 text-sm">
                {new Date(fechaOferta).toLocaleString()}
            </p>
        </div>
        <div className='ml-auto'>
        </div>
    </div>

  );
};

export default OfferCard;