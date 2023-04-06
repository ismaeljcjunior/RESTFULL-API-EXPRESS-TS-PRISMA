import express, { Express, Request, Response } from 'express'
// import { createUser, deleteUser, getUsers, updateUser } from '../controller/usuarioController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../utils/logger"
import morganBody from 'morgan-body'
import fs from 'fs'
import path from 'path'
import { mainRoute, postUser } from '../controller/usuarioController'


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

// app.post('/usuariosB64', createUser)
// app.put('/usuariosB64/:id', updateUser)
// app.delete('/usuariosB64/:id', deleteUser)
// app.get('/usuarios', getUsers)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')
    logger.info('Server is running 1.0')
})

export const appRoutes = app