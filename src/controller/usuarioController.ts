import * as dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import { IUsuarioUPDATEProps, IUsuarioCREATEProps } from './../interfaces/IuserInterface';
import { loggerApiService } from '../utils/loggerAPISERVICE'

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
            postUser(req, res, dataJson)
        } else {
            putUser(req, res, dataJson, user)
            console.log('User exists')
        }
    } catch (e) {
        console.log(e)
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

                // await prisma.$queryRawUnsafe(`UPDATE  usuariossestsenat SET idUsuario_SCOND = '${resPost.data.id}' WHERE (sobrenome = ${jsonUsuario.sobrenome});`)

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


                // await prisma.$transaction([
                //     prisma.usuariosSESTSENAT.updateMany({
                //         where: {
                //             sobrenome: Number(newJsonUsuario.matricula),
                //         },
                //         data: {
                //             nome: newJsonUsuario.nome,
                //             sobrenome: Number(newJsonUsuario.matricula),
                //             matricula: Number(newJsonUsuario.matricula),
                //             dataNascimento: newJsonUsuario.dataNascimento,
                //             sociedade: newJsonUsuario.sociedade,
                //             email: newJsonUsuario.email,
                //             nomeTratamento: newJsonUsuario.nomeTratamento,
                //             telefone: newJsonUsuario.telefone,
                //             telefone2: newJsonUsuario.telefone2,
                //             profissao: 'Aluno',
                //             grupoPessoa: 'Aluno',
                //             fotoFacial: newJsonUsuario.fotoFacial,
                //             situacao: 'Atualizado',
                //         },
                //     }),
                //     prisma.usuariosSESTSENATDocumentoDTO.updateMany({
                //         where: {
                //             usuariosSESTSENAT: {
                //                 sobrenome: Number(newJsonUsuario.matricula),
                //             },
                //         },
                //         data: {
                //             tipoDocumento: newJsonUsuario.tipoDocumento,
                //             documento: newJsonUsuario.documento,
                //         },
                //     }),
                // ]);

                // console.log('Post response:', resPut.data)
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

        res.status(200).json({ data: getUser })
    } catch (err: unknown) {
        console.error('Error during API call outside:', err)
        return res.status(404).json({ response: err })
    }

}