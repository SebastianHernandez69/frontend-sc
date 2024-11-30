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

// interfaces/question-interface.ts
export interface Question {
    id: string;  // Asegúrate de que 'id' esté en la interfaz
    titulo: string;
    descripcion: string;
    fechaPublicacion: string;
    materia: {
        materia: string;
    };
    imgpregunta: Array<{ img: string }>;
}
// interfaces/question-interface.ts

export interface Question {
    idPregunta: number;
    titulo: string;
    descripcion: string;
    fechaPublicacion: string;
    materia: {
      materia: string;
    };
    imgpregunta: Array<{ img: string }>;
    estado: "pendiente" | "aceptada" | "contestada";  // Agregar esta línea para que 'estado' sea una propiedad válida
  }
  