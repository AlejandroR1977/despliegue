import { t } from "../trpc/init";
import { prisma } from '../prisma.init'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { COOKIES_AUTH_TOKEN_KEY, JWT_SECRET } from '../constants'
import { TRPCError } from "@trpc/server";


const userHelper = (user: Awaited<ReturnType<typeof prisma.users.findFirst>>) => {
    return {
        user_id: user!.user_id,
        username: user!.username,
        hashed_password: user!.hashed_password,
        deleted: user!.deleted,
        email: user!.email,
        phone_number: user!.phone_number,
        role: user!.role

    }

}

export const authMiddleware = t.middleware(async ({ ctx, next }) => {

    const authToken = ctx.req.cookies[COOKIES_AUTH_TOKEN_KEY]

    let user

    if (!authToken) {
        user = await prisma.users.getGuest()
        return next({
            ctx: {
                ...ctx, user: userHelper(user)
            }
        })
    }

    try {
        const object = jwt.verify(authToken, JWT_SECRET)

        const id = Number(object.sub)

        if (isNaN(id)) {

            ctx.res.clearCookie(COOKIES_AUTH_TOKEN_KEY)
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Tu sesión es inválida'
            })
        }

        user = await prisma.users.getUserById(id)

        if (!user) {
            ctx.res.clearCookie(COOKIES_AUTH_TOKEN_KEY)

            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Tu usuario no existe'
            })
        }

        return next({
            ctx: {
                ...ctx, user: userHelper(user)
            }
        })
    } catch (err) {
        ctx.res.clearCookie(COOKIES_AUTH_TOKEN_KEY)

        if (err instanceof TokenExpiredError) {

            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Tu sesión expiró'
            })
        }

        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Tu sesión es inválida'
        })
    }
})
