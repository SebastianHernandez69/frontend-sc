
export interface UserProfile {
    idUsuario?:number;
    nombre: {
        idNombre: number;
        primerNombre: string;
        segundoNombre?: string;
        primerApellido: string;
        segundoApellido?: string;
    };
    edad: number;
    correo: string;
    dni: string;
    telefono: string;
    valoracion: number;
    fotoPerfil: string;
    horarioDisponibleInicio: string;
    horarioDisponibleFin: string;
    rol: {
        idRol: number;
        rol: string;
    };
    experiencia?: {
        idExperiencia: number;
        idUsuario: number;
        idPuesto: number;
        empresa: string;
        fechaInicio: Date;
        fechaFin: Date;
        descripcion: string;
        puesto: {
            idPuesto: number,
            puesto: string
        }
    } [];
    conocimiento?: {
        idConocimiento: number;
        idUsuario: number;
        idInstitucion: number;
        tituloAcademico: string;
        fechaEgreso: Date;
        institucion: {
            idInstitucion: number;
            institucion: string;
        }  
    }[];
    materia_tutor?:{
        materia: {
            idMateria: number;
            idCategoria: number;
            materia: string;
        };
    }[];

}

export interface ValoracionUser{
    promedio: number;
    cant: number;
}
