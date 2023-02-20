export interface IUsuarioProps {
    nome: string
    cpf: string
    email: string
    fotourl: string
    fotoBase64: string
}
export interface IUsuarioUPDATEProps {
    nome?: string
    cpf?: string
    email?: string
    fotourl?: string
    fotoBase64?: string
}
export interface IUsuarioDELProps {
    cpf: string
}