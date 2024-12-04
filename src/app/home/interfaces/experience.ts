
export interface Experience{
    idExperiencia: number;
    puesto: string;
    empresa: string;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string;
}

export interface Conocimiento{
    idConocimiento: number;
    institucion: string;
    tituloAcademico: string;
    fechaEgreso: Date;
}

export interface ConocimientoForm{
    idInstitucion: string;
    tituloAcademico: string;
    fechaEgreso: Date;
}

export interface ExperienceForm{
    idPuesto: string;
    empresa: string;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string;
}