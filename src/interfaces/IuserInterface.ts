import * as z from 'zod'

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
    fotoFacial?: string;
}
export interface ISendUsuarioProps {
    criarUsuario: true,
    nome: string,
    sobrenome: string,
    dataNascimento: string,
    sociedade: "PESSOA_FISICA",
    documentosDTO: DocumentoDTO[],
    email: string,
    nomeTratamento: string,
    telefone: string,
    telefone2: string,
    profissao: string,
    grupoPessoa: string,
    fotoFacial: string
}
export const documentoSchema = z.object({
    tipoDocumento: z.string(),
    documento: z.string(),
}).required()
export const userSchema = z.object({
    criarUsuario: z.boolean(),
    nome: z.string(),
    sobrenome: z.string(),
    dataNascimento: z.string(),
    sociedade: z.string().optional(),
    email: z.string().email(),
    nomeTratamento: z.string(),
    profissao: z.string(),
    documentosDTO: z.array(documentoSchema).min(1),
    telefone: z.string(),
    telefone2: z.string(),
    grupoPessoa: z.string(),
    fotoFacial: z.string(),
}).required()