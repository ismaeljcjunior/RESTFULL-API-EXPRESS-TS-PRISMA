// import * as dotenv from 'dotenv'
// dotenv.config()
// import { Request, Response } from 'express'
// import { PrismaClient } from '@prisma/client'
// import { logger } from '../utils/logger'
// import axios from 'axios'
// import { IUsuarioUPDATEProps,  IUsuarioCREATEProps } from './../interfaces/IuserInterface';

// const prisma = new PrismaClient()

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
// export const deleteUser = async (req: Request, res: Response) => {
//     const id = req.params.id;
//     let matricula;

//     const optionsLogin = {
//         headers: {
//             'content-type': 'multipart/form-data',
//             Authorization: process.env.LOGIN_AUTHORIZATION as string,
//         },
//     };
//     const optionsRefreshLogin = {
//         headers: {
//             'content-type': 'multipart/form-data',
//             Authorization: process.env.LOGIN_AUTHORIZATION,
//             tenant: process.env.LOGIN_TENANT as string,
//         },
//     };
//     let objData = {
//         access_token: '',
//         refresh_token: '',
//         grant_type: 'refresh_token',
//         token_type: '',
//         Authorization: process.env.LOGIN_AUTHORIZATION,
//         tenant: process.env.LOGIN_TENANT,
//         newAccess_token: '',
//         newRefresh_token: '',
//     };
//     let dataLogin = {
//         username: process.env.USER_LOGIN,
//         password: process.env.USER_PASSWORD,
//         grant_type: 'password',
//     };
//     let dataRefresh = {
//         grant_type: process.env.LOGIN_GRANT_TYPE,
//         refresh_token: '',
//     };

//     try {
//         const resLogin = await axios.post(process.env.API_URL_LOGIN as string, dataLogin, optionsLogin);
//         objData.access_token = resLogin.data.access_token;
//         objData.refresh_token = resLogin.data.refresh_token;
//         objData.token_type = resLogin.data.token_type;
//         dataRefresh.refresh_token = resLogin.data.refresh_token;

//         const resRefresh = await axios.post(process.env.API_URL_REFRESH as string, dataRefresh, optionsRefreshLogin);
//         objData.newAccess_token = resRefresh.data.access_token;
//         objData.newRefresh_token = resRefresh.data.refresh_token;

//         try {
//             const user: any = await prisma.usuariosSESTSENAT.findFirst({
//                 where: {
//                     sobrenome: Number(id),
//                 }
//             });
//             matricula = user.idUsuario_SCONSD;
//         } catch (e) {
//             console.log(e);
//             res.status(400).json({ errors: 'usuario nao encontrado', e });
//             return;
//         }

//         const resGet = await axios.delete(`${process.env.API_URL_DEL}${matricula}` as string, {
//             headers: {
//                 'content-type': 'application/json',
//                 Authorization: `bearer ${objData.newAccess_token}`,
//                 tenant: process.env.LOGIN_TENANT,
//             },
//         });
//         const result = await prisma.$queryRawUnsafe(`UPDATE usuariossestsenat SET situacao = 'DESABILITADO' WHERE (sobrenome = '${id}');`);

//         logger.info('Success', JSON.stringify(resGet.data), null, 2);
//         res.status(200).json({ response: resGet.data });
//     } catch (e: any) {
//         console.log('catch', e);
//         console.error('Error:', e.response.data);
//         res.status(500).json({ error: e.response.data });
//     }
// }
// export const getUserB64 = async (req: Request, res: Response) => {
//     const matricula: number = Number(req.params.id)
//     console.log(matricula);

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
//         const resLogin = await axios.post(process.env.API_URL_LOGIN as string, dataLogin, optionsLogin);
//         objData.access_token = resLogin.data.access_token;
//         objData.refresh_token = resLogin.data.refresh_token;
//         objData.token_type = resLogin.data.token_type;
//         dataRefresh.refresh_token = resLogin.data.refresh_token;

//         const resRefresh = await axios.post(process.env.API_URL_REFRESH as string, dataRefresh, optionsRefreshLogin);
//         objData.newAccess_token = resRefresh.data.access_token;
//         objData.newRefresh_token = resRefresh.data.refresh_token;

//         // @ts-ignore
//         const resGet = await axios.get(`${process.env.API_URL_GET}${user.idUsuario_SCONSD}` as string, jsonUsuario, {
//             headers: {
//                 "content-type": "application/json",
//                 "Authorization": `bearer ${objData.newAccess_token}`,
//                 "tenant": process.env.LOGIN_TENANT
//             }
//         })

//         logger.info('Success', JSON.stringify(resGet.data), null, 2)
//         res.status(200).json({ response: resGet.data })
//         console.log(resGet);


//     } catch (e: any) {
//         console.log('catch', e)
//         console.error('Error:', e.response.data);
//         res.status(500).json({ error: e.response.data });
//     }

// }
// export const getUsers = async (req: Request, res: Response) => {
//     try {

//         const getAllUsers = await prisma.usuariosSESTSENAT.findMany()
//         logger.info(JSON.stringify({ Message: 'Get all users', Error: 'false' }))

//         res.status(200).json({ getAllUsers })
//     } catch (e) {
//         logger.error(JSON.stringify({ Error: e, Status: '404' }))
//         res.status(404).send(e)
//     }
// }