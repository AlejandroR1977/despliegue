import { TRPCError } from '@trpc/server'
import { COOKIES_AUTH_TOKEN_KEY, JWT_SECRET } from '../constants'
import jwt from 'jsonwebtoken'
import { t } from '../trpc/init'
import { LogInInputSchema, LogInOutputSchema, SignUpInputSchema } from '../schemas/auth.schema'
import { prisma } from '../prisma.init'
import { hashSHA256Hex } from '../utils/hash'
import { authMiddleware } from '../middlewares/auth.middleware'
import { json } from '../utils/json'

export const authRouter = t.router({
  logIn: t.procedure
    .input(LogInInputSchema)
    .output(LogInOutputSchema)
    .query(async (opts) => {
      const username = opts.input.username
      const password = await hashSHA256Hex(opts.input.password)

      const user = await prisma.users.findFirst({
        where: {
          username,
          hashed_password: password
        }
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND'
        })
      }

      const authToken = jwt.sign({ sub: user.user_id.toString() }, JWT_SECRET, {
        expiresIn: '2 days'
      })
      opts.ctx.res.cookie(COOKIES_AUTH_TOKEN_KEY, authToken)



      return { ...user, user_id: user.user_id.toString() }
    }
    ),
  register: t.procedure
    .input(SignUpInputSchema)
    .query(async (opts) => {
      const userWithSameUsername = await prisma.users.findFirst({ where: { username: opts.input.username } })

      if (userWithSameUsername) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'username'
        })
      }

      const userWithSameEmail = await prisma.users.findFirst({ where: { email: opts.input.email } })

      if (userWithSameEmail) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'email'
        })
      }


      const userWithSamePhoneNumber = await prisma.users.findFirst({ where: { phone_number: opts.input.phone_number } })

      if (userWithSamePhoneNumber) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'phone_number'
        })
      }

      const newUser = await prisma.users.create({
        data: {
          username: opts.input.username,
          hashed_password: await hashSHA256Hex(opts.input.password),
          email: opts.input.email,
          phone_number: opts.input.phone_number,
          role: 'USER'
        }
      })

      return json(newUser)
    }),
  logOut: t.procedure
    .query((opts) => {

      opts.ctx.res.clearCookie(COOKIES_AUTH_TOKEN_KEY)

      return true
    }),
  profile: t.procedure
    .use(authMiddleware)
    .output(LogInOutputSchema)
    .query(({ ctx }) => {

      return { ...ctx.user, user_id: ctx.user.user_id.toString() }
    })
}) 
