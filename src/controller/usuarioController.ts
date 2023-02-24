import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { IUsuarioDELProps, IUsuarioProps, IUsuarioUPDATEProps } from '../interfaces/IuserInterface'
import { logger } from '../logger/logger'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

const prisma = new PrismaClient()
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
})
const userSchema = z.object({
    nome: z.string().min(1),
    fotoBase64: z.string().min(1),
    cpf: z.string().length(11),
    email: z.string().min(1),
    fotoUrl: z.string().min(1),
}).required()
const upload = multer({ storage });


export const createUserB64 = async (req: Request, res: Response) => {
    try {
        const users = userSchema.array().parse(req.body as IUsuarioProps[]);
        for (const { nome, email, cpf, fotoUrl, fotoBase64 } of users) {
             console.log('--->',users);
            const usuario = await prisma.testUser.create({
                data: {
                    nome,
                    email,
                    cpf,
                    fotoUrl,
                    fotoBase64,
                },
            })
        }
        res.status(200).json({ Message: 'Usuários salvos!', Error: 'Falso', Status: '200 ok' })
        return
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            const errorMessages = e.issues.map((issue) => issue.message);
            console.log(e.errors);
            return res.status(401).json({ Message: 'Usuários não salvos!', Error: 'Verdadeiro', Status: '400', error: errorMessages });
        } else if (e.code === 'P2002') {
            // console.log(e);
            return res.status(401).json({ error: 'Erro interno do banco de dados', e });
        }
    }
}
export const updateUserB64 = async (req: Request, res: Response) => {
    try {
        const { nome, email, cpf, fotoUrl, fotoBase64 } = userSchema.parse(req.body as IUsuarioUPDATEProps)
        const updateUser = await prisma.testUser.update({
            where: {
                cpf
            },
            data: {
                nome: nome,
                email: email,
                fotoUrl: fotoUrl,
                fotoBase64: fotoBase64
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
        const { cpf } = req.body as IUsuarioDELProps
        const deleteUser = await prisma.testUser.delete({
            where: {
                cpf: cpf
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
        const getAllUsers = await prisma.testUser.findMany()
        req.log.info({ Message: 'Listar todos usuários', Error: 'falso' })
        // res.status(200).json({Message:'Get all users' ,Error: 'false'  })
        res.status(200).json({ getAllUsers })
    } catch (e) {
        req.log.error(e)
        res.status(500).send(e)
    }
}



export const createUser = async (req: Request, res: Response) => {
    try {
        const { nome, email, cpf, fotoUrl, fotoBase64 } = userSchema.parse(req.body as IUsuarioProps)
        const photo: string = req.file ? req.file.path : '';

        if (photo !== '' || nome == '' || email == '' || fotoBase64 == '') {
            const usuario = await prisma.testUser.create({
                data: {
                    nome,
                    email,
                    cpf,
                    fotoUrl,
                    fotoBase64,
                },
            })
            res.status(200).json({ Message: 'User successfully saved', Error: 'False' })
        } else {
            console.log('pimba')
            // console.log(req.body)
            res.status(400).json({ message: 'Erro ao salvar usuário: foto não enviada' });
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(e)
    }
}