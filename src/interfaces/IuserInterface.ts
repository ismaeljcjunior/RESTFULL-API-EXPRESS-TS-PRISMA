

export interface IUsuarioUPDATEProps {
    id?: string,
    nome?: string,
    sobrenome?: number,
    matricula?: string,
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
export interface IUsuarioDELProps {
    id: string;
    dataId: string | number;
}
export interface DocumentoDTO {
    tipoDocumento: string;
    documento: string;
    idDocumentoDTO?: number
    usuariosSESTSENATIdUsuario?: number | string
}
export interface IUsuarioCREATEProps {
    criarUsuario?: true,
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
