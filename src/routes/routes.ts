import express, { Express, Request, Response } from 'express'
import { createUser, createUserB64, getUsers } from '../controller/usuarioController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../../src/logger/logger"
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

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

app.post('/usuarios', upload.single('photo'), createUser)
app.post('/usuariosB64', createUserB64)

app.get('/usuarios', getUsers)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')
    req.log.info('Server is running 1.0')
})

export const appRoutes = app