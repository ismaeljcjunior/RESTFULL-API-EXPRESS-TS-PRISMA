import { AxiosResponse } from "axios";

export interface IUsuarioProps {
    criarUsuario: boolean,
    nome: string,
    sobrenome: string,
    dataNascimento: string,
    sociedade: string,
    tipoDocumento1: string,
    documento1: string,
    tipoDocumento2: string,
    documento2: string,
    documentosDTO: string,
    email: string,
    nomeTratamento: string,
    profissao: string,
    telefone: string,
    telefone2: string,
    grupoPessoa: string,
    fotoFacial: string,
}
export interface IUsuarioUPDATEProps {
    criarUsuario?: boolean,
    nome?: string,
    sobrenome?: string,
    dataNascimento?: string,
    sociedade?: string,
    tipoDocumento1?: string,
    documento1: string,
    tipoDocumento2?: string,
    documento2: string,
    email?: string,
    nomeTratamento?: string,
    profissao?: string,
    telefone?: string,
    telefone2?: string,
    grupoPessoa?: string,
    fotoFacial: string,
}
export interface IUsuarioDELProps {
    email: string
}

export interface DocumentoDTO {
    tipoDocumento: string;
    documento: string;
}

export interface Data {
    criarUsuario: boolean;
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    sociedade: string;
    documentosDTO: DocumentoDTO[];
    email: string;
    nomeTratamento: string;
    telefone: string;
    telefone2: string;
    profissao: string;
    grupoPessoa: string;
    
}
