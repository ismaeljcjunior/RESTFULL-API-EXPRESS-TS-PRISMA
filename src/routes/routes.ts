import express, { Express, Request, Response } from 'express'
import { createUserB64, getUsers, updateUserB64 } from '../controller/usuarioController'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../../src/logger/logger"
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { deleteUserB64 } from './../controller/usuarioController';

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


app.post('/usuariosB64', createUserB64)
app.put('/usuariosB64', updateUserB64)
app.delete('/usuariosB64', deleteUserB64)
app.get('/usuarios', getUsers)

// app.post('/usuarios', upload.single('photo'), createUser)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running 1.0')
    req.log.info('Server is running 1.0')
})

export const appRoutes = app