import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger } from "../utils/logger"
import morganBody from 'morgan-body'
import fs from 'fs'
import stream from 'stream'
import path from 'path'
import { getUserSC, getUsers, mainRoute, postUser } from '../controller/usuarioController'

const app: Express = express()
const logFilePath = path.join('logger', 'serverHTTP.log');
const maxLogFileSize = 50 * 1024 * 1024; // 50 MB

const logFileWriteStream = fs.createWriteStream(logFilePath, { flags: 'a' });
const limitedLogStream = new stream.Writable({
  write: (chunk, encoding, callback) => {
    fs.stat(logFilePath, (err, stats) => {
      if (err) {
        callback(err);
      } else if (stats.size < maxLogFileSize) {
        logFileWriteStream.write(chunk, encoding, callback);
      } else {
        callback();
      }
    });
  }
});

app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
morganBody(app, {
    noColors: true,
    stream: limitedLogStream
})

app.post('/usuarios', mainRoute)
app.get('/usuarios/:id', getUsers)
app.get('/usuariosC/:id', getUserSC)

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running integration 1.0')
    logger.info('Server is running integration 1.0')
    console.log('Server is running integration 1.0')
})

export const appRoutes = app
