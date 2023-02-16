import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IUsuarioProps } from "../interfaces/IuserInterface";
import { logger } from '../logger/logger';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nome, email, photoUrl } = req.body as IUsuarioProps
        const usuario = await prisma.testUser.create({
            data: {
                nome,
                email,
                photoUrl,
            },
        });
        res.send(usuario)
    } catch (e) {
        req.log.error(e)
        res.status(500).send(e)
    }
}
export const getUsers = async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.testUser.findMany();
        console.log(usuarios)
        req.log.info(usuarios)
        res.status(200).json({ usuarios });
    } catch (e) {
        req.log.error(e);
        res.status(500).send(e);
    }
}