import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { IUsuarioProps } from '../interfaces/IuserInterface'
import { logger } from '../logger/logger'
import fs from 'fs'

const prisma = new PrismaClient()

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nome, email, fotoBase64 } = req.body as IUsuarioProps
        const usuario = await prisma.testUser.create({
            data: {
                nome,
                email,
                fotoBase64,
            },
        })
        res.status(200).json({ Message: 'User successfully saved', Error: 'False' })
    } catch (e) {
        logger.error(e)
        res.status(500).send(e)
    }
}
export const getUsers = async (req: Request, res: Response) => {
    try {
        const getAllUsers = await prisma.testUser.findMany()
        req.log.info({Message:'Get all users' ,Error: 'false'  })
        // res.status(200).json({Message:'Get all users' ,Error: 'false'  })
        res.status(200).json({ getAllUsers })
    } catch (e) {
        req.log.error(e)
        res.status(500).send(e)
    }
}