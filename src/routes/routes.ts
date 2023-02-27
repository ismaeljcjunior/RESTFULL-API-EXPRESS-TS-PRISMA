import express, { Express, Request, Response } from 'express'
import { createUserB64, getUsers, updateUserB64 } from '../controller/usuarioController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../../src/logger/logger"
import { deleteUserB64, sendUser } from './../controller/usuarioController';


const app: Express = express()

app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.post('/usuariosB64', createUserB64)
app.put('/usuariosB64', updateUserB64)
app.delete('/usuariosB64', deleteUserB64)
app.get('/usuarios', getUsers)
app.post('/api', sendUser)

// app.post('/usuarios', upload.single('photo'), createUser)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')

})

export const appRoutes = app