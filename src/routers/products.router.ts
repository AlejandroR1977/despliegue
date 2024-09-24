import { t } from '../trpc/init'
import { prisma } from '../prisma.init'
import { z } from 'zod'

const types = ['BEBIDAS', 'DOGOS', 'HAMBURGUESAS', 'ENSALADAS', 'PAPAS', 'DULCES'] as const
const typesSchema = z.enum(types)

export const productsRouter = t.router({
    getProducts:

        t.procedure.input(

            z.object({
                type: z.optional(typesSchema)
            })
        )

            .query(async (opts) => {
                let rawProducts
                if (opts.input.type?.length) {
                    rawProducts = await prisma.products.findMany(
                        {
                            where: {
                                type: opts.input.type as z.infer<typeof typesSchema>
                            }
                        }
                    )
                } else {
                    rawProducts = await prisma.products.findMany()
                }

                const parseProducts = rawProducts.map((product => ({
                    ...product,
                    product_id: product.product_id.toString()
                })))

                return parseProducts
            }),
    getProduct: t.procedure
            .input(z.number().or(z.string()))
            .query(async ({input}) => {
                
                let productId = typeof input == 'string'? BigInt(input) : input

                const product = await prisma.products.findUnique({where: {product_id: productId}})

                return product
                
            })
})