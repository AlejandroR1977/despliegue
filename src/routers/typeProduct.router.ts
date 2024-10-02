import { z } from "zod";
import { prisma } from "../prisma.init";
import { t } from "../trpc/init";
import { TRPCError } from "@trpc/server";
import { TypeProductQuerySchema } from "../schemas/typeProduct.schema";

export const typeProductRouter = t.router({
  getTypeProducts: t.procedure
  // .output(z.promise(z.array(TypeProductQuerySchema)))
  .query(async () => {

    return await prisma.product_types.findMany()
  }),

  getTypeOfProduct: t.procedure
    .input(z.object({product_id: z.string().or(z.number())}))
    .output(z.promise(TypeProductQuerySchema.or(z.null())))
    .query(async ({input}) => {
      try {
        const id = BigInt(input.product_id)
        const product = await prisma.products.findUnique({
          where: {
            product_id: id
          },
          include: {
            product_types: true
          }
        })

        if(!product) throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'product_id'
        })

        return product.product_types
        
      } catch(err){
        throw new TRPCError({
          code: 'UNPROCESSABLE_CONTENT',
          message: 'product_id'
        })
      }
    })
})