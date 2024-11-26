import { TRPCError } from "@trpc/server";
import { t } from "../trpc/init";
import { prisma } from "../prisma.init";

export const validProductTypeMiddleware = t.middleware(async ({ input, next, ctx }) => {
  if (!input) throw new TRPCError({ message: 'La petición debe contener el id del tipo de producto', code: 'BAD_REQUEST' })
  if (typeof input != 'object') throw new TRPCError({ message: 'La peticion debe contener el id del tipo de producto', code: 'BAD_REQUEST' })

  const nonNullInput = input as { type: any }

  if (typeof nonNullInput.type != 'number') throw new TRPCError({ message: 'El id del tipo de producto debe ser un número', code: 'BAD_REQUEST' })

  const productType = await prisma.product_types.findFirst({ where: { product_type_id: nonNullInput.type } })

  if (!productType) throw new TRPCError({ message: 'El tipo de producto no existe', code: 'NOT_FOUND' })

  return next({
    ctx: {
      ...ctx,
      productType
    }
  })

})


export const validProductNameMiddleware = t.middleware(async (opts) => {
  if (!opts.input) throw new TRPCError({ message: 'La petición debe contener el id del tipo de producto', code: 'BAD_REQUEST' })
  if (typeof opts.input != 'object') throw new TRPCError({ message: 'La peticion debe contener el id del tipo de producto', code: 'BAD_REQUEST' })

  const nonNullInput = opts.input as { name: any }

  if (typeof nonNullInput.name != 'string') throw new TRPCError({ message: 'El nombre del producto debe ser una cadena de texto', code: 'BAD_REQUEST' })


  const existingProduct = await prisma.products.findFirst({ where: { name: nonNullInput.name } })

  if (existingProduct) {
    throw new TRPCError(
      {
        code: 'CONFLICT',
        message: 'name'
      }
    )
  }

  return opts.next({
    ctx: {
      ...opts.ctx
    }
  })
})


export const validProductIdMiddleware = t.middleware(async ({ input, next, ctx }) => {
  if (!input) throw new TRPCError({ message: 'La petición debe contener el id del producto', code: 'BAD_REQUEST' })
  if (typeof input != 'object') throw new TRPCError({ message: 'La peticion debe contener el id del producto', code: 'BAD_REQUEST' })

  const nonNullInput = input as { product_id: any }
  console.log(typeof nonNullInput.product_id)
  if (typeof nonNullInput.product_id != 'string' && typeof nonNullInput.product_id != 'number') throw new TRPCError({ message: 'El id del producto debe ser un número o una cadena de texto', code: 'BAD_REQUEST' })

  try {
    const productId = typeof nonNullInput.product_id == 'string' ? BigInt(nonNullInput.product_id) : BigInt(nonNullInput.product_id)
    const product = await prisma.products.findFirst({ where: { product_id: productId } })

    if (!product) throw new TRPCError({ message: 'El producto no existe', code: 'NOT_FOUND' })

    return next({
      ctx: {
        ...ctx,
        product
      }
    })
  } catch (error) {
    throw new TRPCError({ message: 'El id del producto es inválido', code: 'BAD_REQUEST' })
  }



})
