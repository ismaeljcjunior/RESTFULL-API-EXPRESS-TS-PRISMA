import * as dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { Data, ISendUsuarioProps, DocumentoDTO } from '../interfaces/IuserInterface'
import { logger } from '../utils/logger'
import axios from 'axios'
import { userSchema } from './../interfaces/IuserInterface';

const prisma = new PrismaClient()

export const createUser = async (req: Request, res: Response) => {
    const optionsLogin = {
        headers: {
            "content-type": "multipart/form-data",
            // "Accept": "*/*",
            // "Accept-Encoding": "gzip, deflate, br",
            // "Connection": "keep-alive",
            "Authorization": process.env.LOGIN_AUTHORIZATION as string
        }
    }
    const optionsRefreshLogin = {
        headers: {
            "content-type": "multipart/form-data",
            "Authorization": process.env.LOGIN_AUTHORIZATION,
            "tenant": process.env.LOGIN_TENANT as string
        }
    }
    let objData = {
        access_token: '',
        refresh_token: '',
        grant_type: 'refresh_token',
        token_type: '',
        Authorization: process.env.LOGIN_AUTHORIZATION,
        tenant: process.env.LOGIN_TENANT,
        newAccess_token: '',
        newRefresh_token: '',
    }
    let dataLogin = {
        username: process.env.USER_LOGIN,
        password: process.env.USER_PASSWORD,
        grant_type: "password"
    }
    let dataRefresh = {
        grant_type: process.env.LOGIN_GRANT_TYPE,
        refresh_token: ''
    }
    try {
        const dataJson = userSchema.parse(await req.body)
        let jsonUsuario: ISendUsuarioProps = {
            criarUsuario: true,
            nome: '',
            sobrenome: 'ALUNO',
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
        jsonUsuario.nome = dataJson.nome
        jsonUsuario.sobrenome = dataJson.sobrenome
        jsonUsuario.dataNascimento = dataJson.dataNascimento
        for (let doc of dataJson.documentosDTO) {
            jsonUsuario.documentosDTO.push(doc);
        }

        jsonUsuario.email = dataJson.email
        jsonUsuario.nomeTratamento = dataJson.nomeTratamento
        jsonUsuario.telefone = dataJson.telefone
        jsonUsuario.telefone2 = dataJson.telefone2
        jsonUsuario.fotoFacial = dataJson.fotoFacial
        const user = await prisma.usuariosSESTSENAT.create({
            data: {
                criarUsuario: jsonUsuario.criarUsuario,
                nome: jsonUsuario.nome,
                sobrenome: jsonUsuario.sobrenome,
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
        try {
            const resLogin = await axios.post(process.env.API_URL_LOGIN as string, dataLogin, optionsLogin);
            objData.access_token = resLogin.data.access_token;
            objData.refresh_token = resLogin.data.refresh_token;
            objData.token_type = resLogin.data.token_type;
            dataRefresh.refresh_token = resLogin.data.refresh_token;

            const resRefresh = await axios.post(process.env.API_URL_REFRESH as string, dataRefresh, optionsRefreshLogin);
            objData.newAccess_token = resRefresh.data.access_token;
            objData.newRefresh_token = resRefresh.data.refresh_token;

            const resGet = await axios.post(process.env.API_URL_GET as string, jsonUsuario, {
                headers: {
                    "content-type": "application/json",
                    "Authorization": `bearer ${objData.newAccess_token}`,
                    "tenant": process.env.LOGIN_TENANT
                }
            })
            console.log(resGet.data)
            logger.info('Success', JSON.stringify(resGet.data), null, 2)
            res.status(200).json({ response: resGet.data })

        } catch (e: any) {
            console.log('catch', e)
            console.error('Error:', e.response.data);
            res.status(500).json({ error: e.response.data });
        }


    } catch (e) {
        console.log('Fail Login', e)
        logger.error(JSON.stringify({ Error: e, Status: '404' }))
        res.status(400).json({ Error: e })
    }
}
export const getUsers = async (req: Request, res: Response) => {
    try {

        const getAllUsers = await prisma.usuariosSESTSENAT.findMany()
        logger.info(JSON.stringify({ Message: 'Get all users', Error: 'false' }))

        res.status(200).json({ getAllUsers })
    } catch (e) {
        logger.error(JSON.stringify({ Error: e, Status: '404' }))
        res.status(404).send(e)
    }
}
