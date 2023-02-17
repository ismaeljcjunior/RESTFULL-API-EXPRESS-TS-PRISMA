import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { IUsuarioProps } from '../interfaces/IuserInterface'
import { logger } from '../logger/logger'
import fs from 'fs'
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
const upload = multer({ storage });
const userSchema = z.object({
    nome: z.string(),
    fotoBase64: z.string(),
    email: z.string().email(),
})

export const createUserB64 = async (req: Request, res: Response) => {
    try {
        const { nome, email, fotoBase64 } = userSchema.parse(req.body as IUsuarioProps)
        const usuario = await prisma.testUser.create({
            data: {
                nome,
                email,
                fotoBase64,
            },
        })
        res.status(200).json({ Message: 'Usuario salvo!', Error: 'Falso', Status: '200 ok' })
    } catch (e) {
        logger.error(e)
        res.status(500).send(e)
    }
}

export const createUser = async (req: Request, res: Response) => {

    try {
        const { nome, email, fotoBase64 } = req.body as IUsuarioProps
        // const { nome, email, fotoBase64 } = userSchema.parse(req.body as IUsuarioProps)
        const photo: string = req.file ? req.file.path : '';

        if (photo !== '' || nome == '' || email == '' || fotoBase64 == '') {
            const usuario = await prisma.testUser.create({
                data: {
                    nome,
                    email,
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

export const getUsers = async (req: Request, res: Response) => {
    try {
        const getAllUsers = await prisma.testUser.findMany()
        req.log.info({ Message: 'Get all users', Error: 'false' })
        // res.status(200).json({Message:'Get all users' ,Error: 'false'  })
        res.status(200).json({ getAllUsers })
    } catch (e) {
        req.log.error(e)
        res.status(500).send(e)
    }
}