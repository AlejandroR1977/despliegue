import { z } from "zod";
import { t } from "../../trpc/init";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../prisma.init";

const inputSchema = z.object({order_id: z.string().or(z.number().int())})

export const getOrderMiddleware = t.middleware(async (opts) => {
  
  const result = inputSchema.safeParse(opts.input)


  if(!result.success) throw new TRPCError({code: 'BAD_REQUEST', message: 'order_id must be a valid number | string'})
    
  let { order_id } = result.data

  if(typeof order_id == 'string') order_id = Number(order_id)
  
  const order = await prisma.orders.findUnique({where: {order_id}})

  if(!order) throw new TRPCError({code: 'NOT_FOUND', message: 'order_id'})

    return opts.next({
      ...opts,
      ctx: {
        ...opts.ctx,
        order
      },
    })

})