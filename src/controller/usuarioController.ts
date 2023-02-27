import * as dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { Data, IUsuarioDELProps, IUsuarioProps, IUsuarioUPDATEProps } from '../interfaces/IuserInterface'
import { logger } from '../logger/logger'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'
import axios from 'axios'
import FormData from 'form-data'

const prisma = new PrismaClient()
const userSchema = z.object({
    criarUsuario: z.boolean(),
    nome: z.string().max(50).min(3),
    sobrenome: z.string().max(255),
    dataNascimento: z.string(),
    sociedade: z.string().optional(),
    tipoDocumento1: z.string(),
    documento1: z.string(),
    tipoDocumento2: z.string(),
    documento2: z.string(),
    email: z.string().email(),
    nomeTratamento: z.string().max(255),
    profissao: z.string(),
    telefone: z.string(),
    telefone2: z.string(),
    grupoPessoa: z.string(),
    fotoFacial: z.string(),
}).required()

export const createUserB64 = async (req: Request, res: Response) => {
    try {
        // const users = userSchema.array().parse(req.body as IUsuarioProps[]);
        // for (const { criarUsuario, nome, sobrenome, dataNascimento, sociedade, tipoDocumento1, documento1, tipoDocumento2, documento2, email, nomeTratamento, profissao, telefone, telefone2, grupoPessoa, fotoFacial } of users) {
        //     console.log('--->', users)
        //     const usuario = await prisma.usuariosSESTSENAT.create({
        //         data: {
        //             criarUsuario,
        //             nome,
        //             sobrenome,
        //             dataNascimento,
        //             sociedade,
        //             tipoDocumento1,
        //             documento1,
        //             tipoDocumento2,
        //             documento2,
        //             email,
        //             nomeTratamento,
        //             telefone,
        //             telefone2,
        //             profissao,
        //             grupoPessoa,
        //             fotoFacial
        //         }
        //     })
        // }
        const { criarUsuario, nome, sobrenome, dataNascimento, sociedade, tipoDocumento1, documento1, tipoDocumento2, documento2, email, nomeTratamento, profissao, telefone, telefone2, grupoPessoa, fotoFacial } = userSchema.parse(req.body);
        const usuario = await prisma.usuariosSESTSENAT.create({
            data: {
                criarUsuario,
                nome,
                sobrenome,
                dataNascimento,
                sociedade,
                tipoDocumento1,
                documento1,
                tipoDocumento2,
                documento2,
                email,
                nomeTratamento,
                telefone,
                telefone2,
                profissao,
                grupoPessoa,
                fotoFacial
            }
        })
        console.log(usuario)
        res.status(200).json({ Message: 'Usuários salvos!', Error: 'Falso', Status: '200 ok' })
        return
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            const errorMessages = e.issues.map((issue) => issue.message)
            console.log(e.errors)
            return res.status(401).json({ Message: 'Usuários não salvos!', Error: 'Verdadeiro', Status: '400', error: errorMessages });
        } else if (e.code === 'P2002') {
            // console.log(e)
            return res.status(401).json({ error: 'Erro interno do banco de dados', e })
        }
    }
}
export const updateUserB64 = async (req: Request, res: Response) => {
    try {
        const { criarUsuario, nome, sobrenome, dataNascimento, sociedade, tipoDocumento1, documento1, tipoDocumento2, documento2, email, nomeTratamento, profissao, telefone, telefone2, grupoPessoa, fotoFacial } = userSchema.parse(req.body as IUsuarioUPDATEProps)
        const updateUser = await prisma.usuariosSESTSENAT.update({
            where: {
                documento1: documento1
            },
            data: {
                nome: nome,
                email: email,

            },
        })
        res.status(200).json({ message: 'Atualizado', data: updateUser })
    } catch (e) {
        logger.error(e)
        res.status(500).send(e)
    }
}
export const deleteUserB64 = async (req: Request, res: Response) => {
    try {
        const { email } = req.body as IUsuarioDELProps
        const deleteUser = await prisma.usuariosSESTSENAT.delete({
            where: {
                email: email
            },
        })
        res.status(200).json({ message: 'Usuario deletado', data: deleteUser })
    } catch (e) {
        logger.error(e)
        res.status(500).send(e)
    }
}
export const getUsers = async (req: Request, res: Response) => {
    try {
        const getAllUsers = await prisma.usuariosSESTSENAT.findMany()
        req.log.info({ Message: 'Listar todos usuários', Error: 'falso' })
        // res.status(200).json({Message:'Get all users' ,Error: 'false'  })
        res.status(200).json({ getAllUsers })
    } catch (e) {
        req.log.error(e)
        res.status(500).send(e)
    }
}

export const sendUser = async (req: Request, res: Response) => {
    const optionsLogin = {
        headers: {
            // "content-type": "multipart/form-data",
            // "Accept": "*/*",
            // "Accept-Encoding": "gzip, deflate, br",
            // "Connection": "keep-alive",
            "Authorization": "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0",
        }
    }
    const optionsRefreshLogin = {
        headers: {
            // "content-type": "multipart/form-data",
            // "Accept": "*/*",
            // "Accept-Encoding": "gzip, deflate, br",
            // "Connection": "keep-alive",
            "Authorization": "Basic Y2VudGVyLWFwaTphcGktc2VjcmV0",
            "tenant": "newline_sistemas_de_seguranca_103147"
        }
    }
    const formDataLogin = new FormData();
    const formDataRefresh = new FormData();
    const formDataGet = new FormData();

    let objDataLogin = {
        access_token: "",
        refresh_token: "",
        token_type: "",
    }
    let objDataRefresh = {
        grant_type: "refresh_token",
        access_token: "",
        refresh_token: "",
    }
    let data: Data = {
        "criarUsuario": true,
        "nome": "integrador teste",
        "sobrenome": "integrador teste",
        "dataNascimento": "09/02/2000",
        "sociedade": "PESSOA_FISICA",
        "documentosDTO": [
            {
                "tipoDocumento": "CPF",
                "documento": "185.836.320-90"
            },
            {
                "tipoDocumento": "RG",
                "documento": "500000"
            }
        ],
        "email": "teste7@scond.com.br",
        "nomeTratamento": "String 255",
        "telefone": "+55 99 99999-9999",
        "telefone2": "+55 99 99999-9999",
        "profissao": "Aluno",
        "grupoPessoa": "Aluno",


    }
    formDataLogin.append('username', process.env.USER_LOGIN as string)
    formDataLogin.append('password', process.env.USER_PASSWORD as string)
    formDataLogin.append('grant_type', process.env.USER_GRANT_TYPE as string)
    try {
        await axios.post(process.env.API_URL_LOGIN as string, formDataLogin, optionsLogin)
            .then(async function (res) {
                // console.log('sucess login', res.data)
                objDataLogin.access_token = res.data.access_token
                objDataLogin.refresh_token = res.data.refresh_token
                objDataLogin.token_type = res.data.token_type

                formDataRefresh.append('refresh_token', objDataLogin.refresh_token)
                formDataRefresh.append("grant_type", "refresh_token")

                await axios.post(process.env.API_URL_REFRESH as string, formDataRefresh, optionsRefreshLogin)
                    .then(async function (res) {
                        objDataRefresh.refresh_token = res.data.refresh_token

                        formDataGet.append('Authorization', `bearer ${objDataRefresh.refresh_token}`)
                        formDataGet.append('tenant', 'newline_sistemas_de_seguranca_103147')


                        // console.log(objDataRefresh);

                        // await axios.post(process.env.API_URL_GET as string, data, {
                        //     headers: { 
                        //     'Authorization': `bearer ${objDataRefresh.access_token}`,
                        //     'Content-Type': 'application/json',
                        //     'tenant': 'newline_sistemas_de_seguranca_103147'
                        // }
                        // })
                        //     .then(async function (res) {
                        //         console.log('_______> PIMBALIZATION SUCCESS',res);

                        //     })


                    })
            })
        res.status(200).json({ Message: 'Sucess Login', Data: objDataLogin })
    } catch (e) {
        console.log('Fail Login', e)
        res.status(400).json({ Error: e })
    }
}