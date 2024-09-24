import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './routers/app.router'
import { createContext } from './trpc/context'
import cors from 'cors'
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

// Configurar la carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (_,res) => res.send('Hello'))