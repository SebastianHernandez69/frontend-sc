export interface Categoria{
    idCategoria: number,
    categoria: string,
    imgCategoria: string
}

export interface Materia {
    idMateria: number;
    idCategoria: number;
    materia: string;
    imgMateria?: string
}

export interface MateriaTutor{
    idMateria:  string;
}