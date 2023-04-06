import * as z from 'zod'


export interface IUsuarioUPDATEProps {
    id?: string,
    nome?: string,
    sobrenome?: number,
    matricula?: string,
    dataNascimento?: string,
    sociedade?: "PESSOA_FISICA",
    documentosDTO: DocumentoDTO[],
    email?: string,
    nomeTratamento?: string,
    profissao?: string,
    telefone?: string,
    telefone2?: string,
    grupoPessoa?: string,
    fotoFacial: string,
}
export interface IUsuarioDELProps {
    id: string;
    dataId: string | number;
}
export interface DocumentoDTO {
    tipoDocumento: string;
    documento: string;
}

export interface ISendUsuarioProps {
    criarUsuario: true,
    nome: string,
    sobrenome?: number,
    matricula?: string,
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
    sobrenome: z.number(),
    matricula: z.string(),
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

export const userSchemaUpdate = z.object({
    nome: z.string(),
    sobrenome: z.number(),
    matricula: z.string(),
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