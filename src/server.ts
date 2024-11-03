import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './routers/app.router'
import { createContext } from './trpc/context'
import cors from 'cors'
import cookieParser from 'cookie-parser'
export const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())


app.use('/trcp', createExpressMiddleware({
    router: appRouter,
    createContext: createContext
}))

app.get('/', (_, res) => res.sendFile('public/index.html'))

app.get('/app', (_, res) => res.send('Hello'))
