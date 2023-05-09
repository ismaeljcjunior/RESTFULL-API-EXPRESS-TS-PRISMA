import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../utils/logger"
import morganBody from 'morgan-body'
import fs from 'fs'
import path from 'path'
import { getUserSC, getUsers, mainRoute } from '../controller/usuarioController'


const app: Express = express()
const logFilePath = path.join('logger', 'serverHTTP.log');
const log = fs.createWriteStream(logFilePath, { flags: 'a' });

app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

morganBody(app, {
    noColors: true,
    stream: log
})

app.post('/usuarios', mainRoute)
app.get('/usuarios/:id', getUsers)
app.get('/usuariosC/:id', getUserSC)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')
    logger.info('Server is running 1.0')
})

export const appRoutes = app