export interface IUsuarioCREATEProps {
    criarUsuario?: boolean,
    nome: string,
    sobrenome?: number,
    matricula?: number,
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
export interface DocumentoDTO {
    tipoDocumento: string;
    documento: string;
    idDocumentoDTO?: number
    usuariosSESTSENATIdUsuario?: number | string
}
export interface IUsuarioUPDATEProps {
    id?: number,
    nome?: string,
    sobrenome?: number,
    matricula?: number,
    dataNascimento?: string,
    sociedade?: "PESSOA_FISICA",
    documentosDTO?: DocumentoDTO[],
    email?: string,
    nomeTratamento?: string,
    profissao?: string,
    telefone?: string,
    telefone2?: string,
    grupoPessoa?: string,
    fotoFacial?: string,
}