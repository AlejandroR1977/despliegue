import { t } from '../trpc/init'
import { productsRouter } from './products.router'
import { ordersRouter } from './orders.router'

export const appRouter = t.router({
    productsRouter,
    ordersRouter
})

export type AppRouter = typeof appRouter