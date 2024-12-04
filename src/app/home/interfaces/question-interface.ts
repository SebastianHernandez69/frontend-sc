export interface Question{
    idPregunta: number;
    idUsuarioPupilo: number;
    titulo: string;
    descripcion: string;
    fechaPublicacion: string;
    idEstadoPregunta: number;
    materia: {
        materia: string
    };
    imgpregunta:{
        img: string
    }[];
    ofertaresolucion?: {
        idOferta: number,
        idEstadoOferta: {
            idEstadoOferta: number;
            estadoOferta: string;
        },
        idPregunta: number,
        descripcion: string,
        fechaOferta: string,
        usuario: {
            idUsuario: number,
            fotoPerfil: string,
            nombre: {
                primerNombre: string,
                primerApellido: string
            }
        }
    }[];
}

export interface AnsweredQuestion{
    titulo: string;
    descripcion: string;
    materia: string;
    nombre: {
        primerNombre: string;
        segundoNombre: string;
        primerApellido: string;
        segundoApellido: string;
    };
    fechaContestada: Date;
}
  