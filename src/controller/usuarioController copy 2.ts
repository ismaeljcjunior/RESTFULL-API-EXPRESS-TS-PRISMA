import * as dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
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
        })
        if (!user) {
            console.log('User not found')
            postUser(req, res, dataJson)
        } else {
            // putUser(req, res, dataJson, user)
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
    jsonUsuario.dataNascimento = dataJson.dataNascimento
    for (let doc of dataJson.documentosDTO) {
        jsonUsuario.documentosDTO.push(doc);
    }
    jsonUsuario.email = dataJson.email
    jsonUsuario.nomeTratamento = dataJson.nomeTratamento
    jsonUsuario.telefone = dataJson.telefone
    jsonUsuario.telefone2 = dataJson.telefone2
    jsonUsuario.fotoFacial = dataJson.fotoFacial

    console.log('---------->post', jsonUsuario, ApiService)

    try {
        const resPost: AxiosResponse = await axios.post(process.env.API_URL_POST as string, jsonUsuario, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${ApiService.newAccess_token}`,
                "tenant": process.env.LOGIN_TENANT,
                "Accept": "application/json" // Set the Accept header to request a JSON response
            }
        });

        console.log('Post response:', resPost.data)
        res.status(200).json({ response: resPost.data })
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            console.error('Error during API call:', err.message)
            return res.status(404).json({ response: err.message })
        } else {
            console.error('Unknown error:', err)
            return res.status(404).json({ response: err })
        }

    }






}
// export const putUser = async (req: Request, res: Response, dataJson: any, user: any) => {
//     const ApiService = await loggerApiService(req, res)
//     if (ApiService == undefined || ApiService == null) {
//         return res.status(404).json({ response: 'error' })
//     }

//     try {
//         const dataJson = await req.body
//         let jsonUsuario: IUsuarioUPDATEProps = {
//             id: '',
//             nome: '',
//             sobrenome: 0,
//             dataNascimento: '',
//             sociedade: "PESSOA_FISICA",
//             documentosDTO: [],
//             email: '',
//             nomeTratamento: '',
//             telefone: '',
//             telefone2: '',
//             profissao: 'Aluno',
//             grupoPessoa: 'Aluno',
//             fotoFacial: ''
//         }

//         jsonUsuario.id = user.idUsuario_SCOND !== null ? user.idUsuario_SCOND.toString() : "";
//         jsonUsuario.nome = dataJson.nome
//         jsonUsuario.sobrenome = Number(dataJson.matricula)
//         jsonUsuario.dataNascimento = dataJson.dataNascimento
//         for (let doc of dataJson.documentosDTO) {
//             jsonUsuario.documentosDTO.push(doc);
//         }
//         jsonUsuario.email = dataJson.email
//         jsonUsuario.nomeTratamento = dataJson.nomeTratamento
//         jsonUsuario.telefone = dataJson.telefone
//         jsonUsuario.telefone2 = dataJson.telefone2
//         jsonUsuario.fotoFacial = dataJson.fotoFacial
//         console.log('---------->put', jsonUsuario)
//     } catch (e) {
//         console.log(e)
//     }

// }
// export const createUser = async (req: Request, res: Response) => {
//     const optionsLogin = {
//         headers: {
//             "content-type": "multipart/form-data",
//             // "Accept": "*/*",
//             // "Accept-Encoding": "gzip, deflate, br",
//             // "Connection": "keep-alive",
//             "Authorization": process.env.LOGIN_AUTHORIZATION as string
//         }
//     }
//     const optionsRefreshLogin = {
//         headers: {
//             "content-type": "multipart/form-data",
//             "Authorization": process.env.LOGIN_AUTHORIZATION,
//             "tenant": process.env.LOGIN_TENANT as string
//         }
//     }
//     let objData = {
//         access_token: '',
//         refresh_token: '',
//         grant_type: 'refresh_token',
//         token_type: '',
//         Authorization: process.env.LOGIN_AUTHORIZATION,
//         tenant: process.env.LOGIN_TENANT,
//         newAccess_token: '',
//         newRefresh_token: '',
//     }
//     let dataLogin = {
//         username: process.env.USER_LOGIN,
//         password: process.env.USER_PASSWORD,
//         grant_type: "password"
//     }
//     let dataRefresh = {
//         grant_type: process.env.LOGIN_GRANT_TYPE,
//         refresh_token: ''
//     }
//     try {
//         const dataJson = await req.body
//         let jsonUsuario: IUsuarioCREATEProps = {
//             criarUsuario: true,
//             nome: '',
//             sobrenome: 0,
//             dataNascimento: '',
//             sociedade: "PESSOA_FISICA",
//             documentosDTO: [],
//             email: '',
//             nomeTratamento: '',
//             telefone: '',
//             telefone2: '',
//             profissao: 'Aluno',
//             grupoPessoa: 'Aluno',
//             fotoFacial: ''
//         }
//         jsonUsuario.nome = dataJson.nome
//         jsonUsuario.sobrenome = Number(dataJson.matricula)
//         jsonUsuario.dataNascimento = dataJson.dataNascimento
//         for (let doc of dataJson.documentosDTO) {
//             jsonUsuario.documentosDTO.push(doc);
//         }
//         jsonUsuario.email = dataJson.email
//         jsonUsuario.nomeTratamento = dataJson.nomeTratamento
//         jsonUsuario.telefone = dataJson.telefone
//         jsonUsuario.telefone2 = dataJson.telefone2
//         jsonUsuario.fotoFacial = dataJson.fotoFacial

//         try {
//             const resLogin = await axios.post(process.env.API_URL_LOGIN as string, dataLogin, optionsLogin);
//             objData.access_token = resLogin.data.access_token;
//             objData.refresh_token = resLogin.data.refresh_token;
//             objData.token_type = resLogin.data.token_type;
//             dataRefresh.refresh_token = resLogin.data.refresh_token;

//             const resRefresh = await axios.post(process.env.API_URL_REFRESH as string, dataRefresh, optionsRefreshLogin)
//             objData.newAccess_token = resRefresh.data.access_token;
//             objData.newRefresh_token = resRefresh.data.refresh_token;

//             const resGet = await axios.post(process.env.API_URL_POST as string, jsonUsuario, {
//                 headers: {
//                     "content-type": "application/json",
//                     "Authorization": `bearer ${objData.newAccess_token}`,
//                     "tenant": process.env.LOGIN_TENANT
//                 }
//             })

//             const user = await prisma.usuariosSESTSENAT.create({
//                 data: {
//                     criarUsuario: jsonUsuario.criarUsuario,
//                     nome: jsonUsuario.nome,
//                     sobrenome: Number(jsonUsuario.sobrenome),
//                     dataNascimento: jsonUsuario.dataNascimento,
//                     documentosDTO: {
//                         createMany: {
//                             data: jsonUsuario.documentosDTO
//                         },
//                     },
//                     sociedade: jsonUsuario.sociedade,
//                     email: jsonUsuario.email,
//                     nomeTratamento: jsonUsuario.nomeTratamento,
//                     telefone: jsonUsuario.telefone,
//                     telefone2: jsonUsuario.telefone2,
//                     fotoFacial: jsonUsuario.fotoFacial,

//                 },
//                 include: { documentosDTO: true },
//             })
//             const result = await prisma.$queryRawUnsafe(`UPDATE usuariossestsenat SET idUsuario_SCOND = '${resGet.data.id}' WHERE (sobrenome = '${jsonUsuario.sobrenome}');`)

//             logger.info('Success', JSON.stringify(resGet.data), null, 2)
//             res.status(200).json({ response: resGet.data })

//         } catch (e: any) {
//             // console.log('catch', e)
//             console.log('Error:', e);
//             res.status(400).json({ e });
//         }


//     } catch (e) {
//         console.log('Fail Login', e)
//         logger.error(JSON.stringify({ Error: e, Status: '404' }))
//         res.status(400).json({ Error: e })
//     }
// }
// export const updateUser = async (req: Request, res: Response) => {
//     const matricula = Number(req.params.id)
//     const optionsLogin = {
//         headers: {
//             "content-type": "multipart/form-data",
//             // "Accept": "*/*",
//             // "Accept-Encoding": "gzip, deflate, br",
//             // "Connection": "keep-alive",
//             "Authorization": process.env.LOGIN_AUTHORIZATION as string
//         }
//     }
//     const optionsRefreshLogin = {
//         headers: {
//             "content-type": "multipart/form-data",
//             "Authorization": process.env.LOGIN_AUTHORIZATION,
//             "tenant": process.env.LOGIN_TENANT as string
//         }
//     }
//     let objData = {
//         access_token: '',
//         refresh_token: '',
//         grant_type: 'refresh_token',
//         token_type: '',
//         Authorization: process.env.LOGIN_AUTHORIZATION,
//         tenant: process.env.LOGIN_TENANT,
//         newAccess_token: '',
//         newRefresh_token: '',
//     }
//     let dataLogin = {
//         username: process.env.USER_LOGIN,
//         password: process.env.USER_PASSWORD,
//         grant_type: "password"
//     }
//     let dataRefresh = {
//         grant_type: process.env.LOGIN_GRANT_TYPE,
//         refresh_token: ''
//     }

//     const user = await prisma.usuariosSESTSENAT.findFirst({
//         where: {
//             sobrenome: matricula,
//         }
//     });

//     try {
//         const dataJson = await req.body
//         let jsonUsuario: IUsuarioUPDATEProps = {
//             id: '',
//             nome: '',
//             sobrenome: 0,
//             dataNascimento: '',
//             sociedade: "PESSOA_FISICA",
//             documentosDTO: [],
//             email: '',
//             nomeTratamento: '',
//             telefone: '',
//             telefone2: '',
//             profissao: 'Aluno',
//             grupoPessoa: 'Aluno',
//             fotoFacial: ''
//         }
//         // @ts-ignore
//         jsonUsuario.id = user.idUsuario_SCONSD !== null ? user.idUsuario_SCONSD.toString() : "";
//         jsonUsuario.nome = dataJson.nome
//         jsonUsuario.sobrenome = Number(dataJson.matricula)
//         jsonUsuario.dataNascimento = dataJson.dataNascimento
//         for (let doc of dataJson.documentosDTO) {
//             jsonUsuario.documentosDTO.push(doc);
//         }
//         jsonUsuario.email = dataJson.email
//         jsonUsuario.nomeTratamento = dataJson.nomeTratamento
//         jsonUsuario.telefone = dataJson.telefone
//         jsonUsuario.telefone2 = dataJson.telefone2
//         jsonUsuario.fotoFacial = dataJson.fotoFacial

//         try {
//             const resLogin = await axios.post(process.env.API_URL_LOGIN as string, dataLogin, optionsLogin);
//             objData.access_token = resLogin.data.access_token;
//             objData.refresh_token = resLogin.data.refresh_token;
//             objData.token_type = resLogin.data.token_type;
//             dataRefresh.refresh_token = resLogin.data.refresh_token;

//             const resRefresh = await axios.post(process.env.API_URL_REFRESH as string, dataRefresh, optionsRefreshLogin);
//             objData.newAccess_token = resRefresh.data.access_token;
//             objData.newRefresh_token = resRefresh.data.refresh_token;

//             // @ts-ignore
//             const resGet = await axios.put(`${process.env.API_URL_PUT}${user.idUsuario_SCONSD}` as string, jsonUsuario, {
//                 headers: {
//                     "content-type": "application/json",
//                     "Authorization": `bearer ${objData.newAccess_token}`,
//                     "tenant": process.env.LOGIN_TENANT
//                 }
//             })

//             await prisma.usuariosSESTSENAT.update({
//                 where: {
//                     sobrenome: Number(jsonUsuario.sobrenome),
//                 },
//                 data: {
//                     nome: jsonUsuario.nome,
//                     sobrenome: Number(jsonUsuario.sobrenome),
//                     dataNascimento: jsonUsuario.dataNascimento,
//                     documentosDTO: {
//                         createMany: {
//                             data: jsonUsuario.documentosDTO
//                         },
//                     },
//                     sociedade: jsonUsuario.sociedade,
//                     email: jsonUsuario.email,
//                     nomeTratamento: jsonUsuario.nomeTratamento,
//                     telefone: jsonUsuario.telefone,
//                     telefone2: jsonUsuario.telefone2,
//                     fotoFacial: jsonUsuario.fotoFacial,

//                 },
//                 include: { documentosDTO: true },
//             })
//             const result = await prisma.$queryRawUnsafe(`UPDATE usuariossestsenat SET situacao = 'Alterado' WHERE (sobrenome = '${matricula}');`);

//             logger.info('Success', JSON.stringify(resGet.data), null, 2)
//             res.status(200).json({ response: resGet.data })

//         } catch (e: any) {
//             console.log('catch', e)
//             console.error('Error:', e.response.data);
//             res.status(500).json({ error: e.response.data });
//         }
//     } catch (e) {
//         console.log('Fail Login', e)
//         logger.error(JSON.stringify({ Error: e, Status: '404' }))
//         res.status(400).json({ Error: e })
//     }
// }
