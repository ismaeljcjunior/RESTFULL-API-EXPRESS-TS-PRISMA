import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client'
import { createUser, getUsers } from './controller/usuarioController';
import { logger } from "../src/logger/logger"
import cors from 'cors';
dotenv.config();

const app: Express = express();
const prisma = new PrismaClient()
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  req.log = logger.child({
    requestId: Math.random().toString(36).substr(2, 9),
  });
  next();
})

////////--------------Routes------------------//////
app.post('/usuarios', createUser)
app.get('/usuarios', getUsers)





////////////////////////////////////
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running 1.0');
  req.log.info('Server is running 1.0');
});

app.listen(port, () => {
  console.log(`⚡️[${port}]: Server is running at http://localhost:${port}`);
  logger.info(`⚡️[${port}]: Server is running at http://localhost:${port}`);
});