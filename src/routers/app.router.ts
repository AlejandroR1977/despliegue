import { t } from '../trpc/init'
import { productsRouter } from './products.router'
import { ordersRouter } from './orders.router'
import { typeProductRouter } from './typeProduct.router'
import { customizationsRouter } from './customizations.router'
import { authRouter } from './auth.router'

export const appRouter = t.router({
    productsRouter,
    ordersRouter,
    typeProductRouter,
    customizationsRouter,
    authRouter
})

export type AppRouter = typeof appRouter
