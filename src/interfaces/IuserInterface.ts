export interface IUsuarioProps {
    criarUsuario: boolean,
    nome: string,
    sobrenome: string,
    dataNascimento:string,
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
    grupo_pessoa: string,
}
export interface IUsuarioUPDATEProps {
    criarUsuario?: boolean,
    nome?: string,
    sobrenome?: string,
    dataNascimento?:string,
    sociedade?: string,
    tipoDocumento1?: string,
    documento1?: string,
    tipoDocumento2?: string,
    documento2?: string,
    email?: string,
    nomeTratamento?: string,
    profissao?: string,
    telefone?: string,
    telefone2?: string,
    grupo_pessoa?: string,
}
export interface IUsuarioDELProps {
    cpf: string
}