import express, { Express, Request, Response } from 'express'
import { createUser, getUsers } from '../controller/usuarioController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../../src/logger/logger"
const port = process.env.PORT

const app: Express = express()
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    req.log = logger.child({
        requestId: Math.random().toString(36).substr(2, 9),
    })
    next()
})

app.post('/usuarios', createUser)
app.get('/usuarios', getUsers)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')
    req.log.info('Server is running 1.0')
})

export const appRoutes = app