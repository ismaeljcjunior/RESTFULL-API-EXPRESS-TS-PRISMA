import * as dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { IUsuarioUPDATEProps, IUsuarioCREATEProps } from './../interfaces/IuserInterface';
import { loggerApiService } from '../utils/loggerAPISERVICE'
import { logger } from '../logger/logger'

const prisma = new PrismaClient()

export const mainRoute = async (req: Request, res: Response) => {
    const dataJson = await req.body
    const userId: number = Number(dataJson.matricula)
    try {
        const user = await prisma.usuariosSESTSENAT.findFirst({
            where: {
                sobrenome: userId,
            },
            include: {
                documentosDTO: true
            }
        })
        if (!user) {
            console.log('User not found')
            logger.info('User not found')
            postUser(req, res, dataJson)
        } else {
            putUser(req, res, dataJson, user)
            console.log('User exists')
            logger.info('User exists')
        }
    } catch (e) {
        console.log(e)
        logger.info(e)
    }
}
export const postUser = async (req: Request, res: Response, dataJson: any) => {
    const ApiService = await loggerApiService(req, res)
    if (ApiService == undefined || ApiService == null) {
        return res.status(404).json({ response: 'error' })
    }

    let jsonUsuario: IUsuarioCREATEProps = {
        criarUsuario: true,
        nome: '',
        sobrenome: 0,
        matricula: 0,
        dataNascimento: '',
        sociedade: "PESSOA_FISICA",
        documentosDTO: [],
        email: '',
        nomeTratamento: '',
        telefone: '',
        telefone2: '',
        profissao: 'Aluno',
        grupoPessoa: 'Aluno',
        fotoFacial: ''
    }
    jsonUsuario.criarUsuario = dataJson.criarUsuario
    jsonUsuario.nome = dataJson.nome
    jsonUsuario.sobrenome = Number(dataJson.matricula)
    jsonUsuario.matricula = Number(dataJson.matricula)
    jsonUsuario.dataNascimento = dataJson.dataNascimento
    for (let doc of dataJson.documentosDTO) {
        jsonUsuario.documentosDTO.push(doc);
    }
    jsonUsuario.email = dataJson.email
    jsonUsuario.nomeTratamento = dataJson.nomeTratamento
    jsonUsuario.telefone = dataJson.telefone
    jsonUsuario.telefone2 = dataJson.telefone2
    jsonUsuario.fotoFacial = dataJson.fotoFacial
    console.log('---------->post', jsonUsuario)

    try {
        const resPost = await axios.post(process.env.API_URL_POST as string, jsonUsuario, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${ApiService.newAccess_token}`,
                "tenant": process.env.LOGIN_TENANT,
                "Accept": "application/json"
            }
        })
            .then(async (resPost: AxiosResponse) => {
                await prisma.usuariosSESTSENAT.create({
                    data: {
                        criarUsuario: jsonUsuario.criarUsuario,
                        nome: jsonUsuario.nome,
                        idUsuario_SCOND: resPost.data.id,
                        sobrenome: Number(jsonUsuario.sobrenome),
                        matricula: Number(jsonUsuario.sobrenome),
                        dataNascimento: jsonUsuario.dataNascimento,
                        documentosDTO: {
                            createMany: {
                                data: jsonUsuario.documentosDTO
                            },
                        },
                        sociedade: jsonUsuario.sociedade,
                        email: jsonUsuario.email,
                        nomeTratamento: jsonUsuario.nomeTratamento,
                        telefone: jsonUsuario.telefone,
                        telefone2: jsonUsuario.telefone2,
                        fotoFacial: jsonUsuario.fotoFacial,

                    },
                    include: { documentosDTO: true },
                })
                console.log('Post response:', resPost.data.id)
                res.status(200).json({ response: resPost.data })
            })
            .catch(async (err: unknown) => {
                if (axios.isAxiosError(err)) {
                    console.error('Error during API call inside:', err)
                    const errorResponse = err.response?.data || err.message;
                    return res.status(404).json({ response: errorResponse })
                } else {
                    console.error('Unknown error inside:', err)
                    return res.status(404).json({ response: err })
                }
            })
    } catch (err: unknown) {
        console.error('Error during API call outside:', err)
        return res.status(404).json({ response: err })
    }
}
export const putUser = async (req: Request, res: Response, dataJson: any, user: any) => {
    const ApiService = await loggerApiService(req, res)
    if (ApiService == undefined || ApiService == null) {
        return res.status(404).json({ response: 'error' })
    }
    let jsonUsuario: IUsuarioUPDATEProps = {
        id: 0,
        nome: '',
        sobrenome: 0,
        matricula: 0,
        dataNascimento: '',
        sociedade: "PESSOA_FISICA",
        // documentosDTO: [],
        email: '',
        nomeTratamento: '',
        telefone: '',
        telefone2: '',
        profissao: 'Aluno',
        grupoPessoa: 'Aluno',
        fotoFacial: ''
    }
    //atualizar dados conforme banco
    jsonUsuario.nome = user.nome
    jsonUsuario.sobrenome = Number(user.matricula)
    jsonUsuario.matricula = Number(user.matricula)
    jsonUsuario.dataNascimento = user.dataNascimento
    jsonUsuario.documentosDTO = []
    for (let doc of user.documentosDTO) {
        jsonUsuario.documentosDTO.push(doc);
    }
    jsonUsuario.email = user.email
    jsonUsuario.nomeTratamento = user.nomeTratamento
    jsonUsuario.telefone = user.telefone
    jsonUsuario.telefone2 = user.telefone2
    jsonUsuario.fotoFacial = user.fotoFacial

    //atualizar dados no objeto
    jsonUsuario.id = user.idUsuario_SCOND
    jsonUsuario.nome = dataJson.nome
    jsonUsuario.sobrenome = Number(user.matricula)
    jsonUsuario.matricula = Number(user.matricula)
    // jsonUsuario.dataNascimento = dataJson.dataNascimento
    // for (let doc of dataJson.documentosDTO) {
    //     jsonUsuario.documentosDTO.push(doc);
    // }
    // jsonUsuario.documentosDTO
    // jsonUsuario.email = dataJson.email
    jsonUsuario.nomeTratamento = dataJson.nomeTratamento
    jsonUsuario.telefone = dataJson.telefone
    jsonUsuario.telefone2 = dataJson.telefone2
    jsonUsuario.fotoFacial = dataJson.fotoFacial

    const newJsonUsuario = {
        ...jsonUsuario,
        documentosDTO: jsonUsuario.documentosDTO.map(({ idDocumentoDTO, usuariosSESTSENATIdUsuario, ...resto }) => resto)
    }
    console.log('user DB', user)
    console.log('user PUT', dataJson)
    console.log('--->', jsonUsuario)
    console.log('---------->put', newJsonUsuario)

    try {
        const resPut = await axios.put(`${process.env.API_URL_PUT}${user.idUsuario_SCOND}` as string, newJsonUsuario, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${ApiService.newAccess_token}`,
                "tenant": process.env.LOGIN_TENANT,
            }
        })
            .then(async (resPut: AxiosResponse) => {

                const updateUser = await prisma.usuariosSESTSENAT.update({
                    where: {
                        sobrenome: Number(newJsonUsuario.matricula),
                    },
                    data: {
                        // idUsuario_SCOND: user.idUsuario_SCOND,
                        nome: newJsonUsuario.nome,
                        sobrenome: Number(newJsonUsuario.matricula),
                        matricula: Number(newJsonUsuario.matricula),
                        // dataNascimento: newJsonUsuario.dataNascimento,
                        sociedade: newJsonUsuario.sociedade,
                        // email: newJsonUsuario.email,
                        nomeTratamento: newJsonUsuario.nomeTratamento,
                        telefone: newJsonUsuario.telefone,
                        telefone2: newJsonUsuario.telefone2,
                        profissao: 'Aluno',
                        grupoPessoa: 'Aluno',
                        fotoFacial: newJsonUsuario.fotoFacial,
                        situacao: 'Atualizado',
                    },

                })

                console.log('Post response:', resPut.data)
                res.status(200).json({ response: resPut.data })
            })
            .catch(async (err: unknown) => {
                if (axios.isAxiosError(err)) {
                    console.error('Error during API call inside:', err)
                    const errorResponse = err.response?.data || err.message;
                    return res.status(404).json({ response: errorResponse })
                } else {
                    console.error('Unknown error inside:', err)
                    return res.status(404).json({ response: err })
                }
            });
    } catch (err: unknown) {
        console.error('Error during API call outside:', err)
        return res.status(404).json({ response: err })
    }
}
export const getUsers = async (req: Request, res: Response) => {
    const userId = Number(req.params.id)

    try {
        const getUser = await prisma.usuariosSESTSENAT.findFirst({
            where: {
                sobrenome: Number(userId),
            },
            include: {
                documentosDTO: true
            }
        })
        if (getUser === undefined || getUser === null) {
            return res.status(404).json({ response: 'Error' })
        }
        if (getUser.hasOwnProperty("idUsuario_SCOND")) {
            //@ts-ignore
            delete getUser?.idUsuario_SCOND
        }

        if (getUser.hasOwnProperty("criarUsuario")) {
            //@ts-ignore
            delete getUser?.criarUsuario
        }
        if (getUser.hasOwnProperty("situacao")) {
            //@ts-ignore
            delete getUser?.situacao
        }
        if (getUser.hasOwnProperty("created_at")) {
            //@ts-ignore
            delete getUser?.created_at
        }
        if (getUser.hasOwnProperty("updated_at")) {
            //@ts-ignore
            delete getUser?.updated_at
        }

        getUser.documentosDTO = getUser.documentosDTO.map(item => {
            if (item.hasOwnProperty("idDocumentoDTO")) {
                //@ts-ignore
                delete item?.idDocumentoDTO
            }

            if (item.hasOwnProperty("usuariosSESTSENATidUsuario_SCOND")) {
                //@ts-ignore
                delete item.usuariosSESTSENATidUsuario_SCOND
            }
            return item
        })


        res.status(200).json({ data: getUser })
    } catch (err: unknown) {
        console.error('Error during API call outside:', err)

        return res.status(404).json({ response: err })
    }

}
export const getUserSC = async (req: Request, res: Response) => {
    const userId = Number(req.params.id)

    const ApiService = await loggerApiService(req, res)
    if (ApiService == undefined || ApiService == null) {
        return res.status(404).json({ response: 'error' })
    }

    try {
        const resultIdScondGet: any = await prisma.$queryRawUnsafe(`SELECT idUsuario_SCOND FROM usuariossestsenat where matricula = '${userId}'`)
        console.log('-------------------->', resultIdScondGet.length);

        if (resultIdScondGet.length > 0) {

        } else {
            console.log('User not found', userId)
            logger.error({ response: 'User not found', id: userId })
            return res.status(400).json({ response: 'User not found', id: userId })
        }
        const idUsuario_SCOND = resultIdScondGet[0].idUsuario_SCOND

        const resGet = await axios.get(`${process.env.API_URL_GET}${idUsuario_SCOND}` as string, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${ApiService.newAccess_token}`,
                "tenant": process.env.LOGIN_TENANT,
            }
        })
        if (resGet === undefined || resGet === null) {
            return res.status(404).json({ response: 'Error' })
        }
        if (resGet.data.hasOwnProperty("id")) {
            //@ts-ignore
            delete resGet.data?.id
        }
        if (resGet.data.hasOwnProperty("enderecos")) {
            //@ts-ignore
            delete resGet.data?.enderecos
        }
        if (resGet.data.hasOwnProperty("pessoaUnidades")) {
            //@ts-ignore
            delete resGet.data?.pessoaUnidades
        }
        if (resGet.data.hasOwnProperty("grupos")) {
            //@ts-ignore
            delete resGet.data?.grupos
        }
        if (resGet.data.hasOwnProperty("perfilAcessos")) {
            //@ts-ignore
            delete resGet.data?.perfilAcessos
        }
        if (resGet.data.hasOwnProperty("primeiroAcesso")) {
            //@ts-ignore
            delete resGet.data?.primeiroAcesso
        }
        if (resGet.data.hasOwnProperty("documentosDTO")) {
            //@ts-ignore
            delete resGet.data?.documentosDTO
        }
        if (resGet.data.hasOwnProperty("criarUsuario")) {
            //@ts-ignore
            delete resGet.data?.criarUsuario
        }
        if (resGet.data.hasOwnProperty("habilitarCampoCriarUsuario")) {
            //@ts-ignore
            delete resGet.data?.habilitarCampoCriarUsuario
        }
        if (resGet.data.hasOwnProperty("nomeCompleto")) {
            //@ts-ignore
            delete resGet.data?.nomeCompleto
        }
        if (resGet.data.hasOwnProperty("gruposAtivos")) {
            //@ts-ignore
            delete resGet.data?.gruposAtivos
        }
        if (resGet.data.hasOwnProperty("pessoaUnidadesAtivas")) {
            //@ts-ignore
            delete resGet.data?.pessoaUnidadesAtivas
        }
        if (resGet.data.hasOwnProperty("administrador")) {
            //@ts-ignore
            delete resGet.data?.administrador
        }
        if (resGet.data.hasOwnProperty("primeiroNome")) {
            //@ts-ignore
            delete resGet.data?.primeiroNome
        }
        if (resGet.data.hasOwnProperty("hibernateLazyInitializer")) {
            //@ts-ignore
            delete resGet.data?.hibernateLazyInitializer
        }
        const documentosSemTipoDocumento = resGet.data.documentos.map((documento: { [x: string]: any; tipoDocumento: any }) => {
            const { tipoDocumento, ...restoDocumento } = documento
            return { ...restoDocumento }
        })

        const resultado = {
            ...resGet.data,
            documentos: documentosSemTipoDocumento,
        }
        logger.info(resultado)
        console.log(resultado)
        res.status(200).json({ data: resultado })
    } catch (err: any) {
        console.error(err)
        logger.info(err)
        return res.status(404).json({ response: err.data })
    }
}