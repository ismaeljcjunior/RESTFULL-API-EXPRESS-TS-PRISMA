import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { IUsuarioDELProps, IUsuarioProps, IUsuarioUPDATEProps } from '../interfaces/IuserInterface'
import { logger } from '../logger/logger'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

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
        const users = userSchema.array().parse(req.body as IUsuarioProps[]);
        for (const { criarUsuario, nome, sobrenome, dataNascimento, sociedade, tipoDocumento1, documento1, tipoDocumento2, documento2, email, nomeTratamento, profissao, telefone, telefone2, grupoPessoa, fotoFacial } of users) {
            console.log('--->', users)
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
        }
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
                email : email
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
