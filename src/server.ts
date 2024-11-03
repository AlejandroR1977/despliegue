import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './routers/app.router'
import { createContext } from './trpc/context'
import cors from 'cors'
//import cookieParser from 'cookie-parser'
import path from 'node:path'

export const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())


app.use('/trcp', createExpressMiddleware({
    router: appRouter,
    createContext: createContext
}))

app.use(express.static(path.join(path.resolve(), "public")));

app.get('*', (req, res) => {
  return res.sendFile(path.join(path.resolve(), "public", "index.html"))
})

app.get('/app', (_,res) => res.send('Hello'))


