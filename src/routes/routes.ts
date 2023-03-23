import express, { Express, Request, Response } from 'express'
import { createUser, getUsers } from '../controller/usuarioController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../utils/logger"
import morganBody from 'morgan-body'
import fs from 'fs'
import path from 'path'

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

app.post('/createuser', createUser)
// app.put('/usuariosB64', updateUserB64)
// app.delete('/usuariosB64', deleteUserB64)
app.get('/usuarios', getUsers)



app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')
    logger.info('Server is running 1.0')
})

export const appRoutes = app