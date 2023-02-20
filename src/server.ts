import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { logger } from '../src/logger/logger'
import { appRoutes } from './routes/routes'
import bodyParser from 'body-parser'
import cors from 'cors'
dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(express.json())
app.use('/', appRoutes)
app.use(cors())

app.listen(port, () => {
  console.log(`⚡️[${port}]: Server is running at http://localhost:${port}`)
  logger.info(`⚡️[${port}]: Server is running at http://localhost:${port}`)
})