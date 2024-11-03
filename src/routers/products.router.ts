import { t } from '../trpc/init'
import { prisma } from '../prisma.init'
import { z } from 'zod'
import { ProductQueryResult } from '../schemas/products.schema'


export const productsRouter = t.router({
    getProducts: t.procedure
        // .output(z.promise(z.array(ProductQueryResult)))
        .query(async () => {
            const products = await prisma.products.findMany({
                include: {
                    product_types: true
                }

            })

            return products.map((product) => {
                return {
                    product_id: product.product_id.toString(),
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    product_type_id: product.product_types!.product_type_id,
                    image_path: product.image_path,
                    type: {
                        product_type_id: product.product_types!.product_type_id!,
                        name: product.product_types!.name,
                        preparation_time: product.product_types!.preparation_time
                    }

                }
            })

        }),
    getProduct: t.procedure
        .input(z.object({ id: z.string().or(z.number()) }))
        .output(z.promise(ProductQueryResult.or(z.null())))
        .query(async ({ input }) => {
            const value = BigInt(input.id)
            const product = await prisma.products.findFirst({ where: { product_id: value }, include: { product_types: true } })

            if (!product) return null

            return {
                product_id: product.product_id.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                product_type_id: product.product_types!.product_type_id,
                image_path: product.image_path,
                type: {
                    product_type_id: product.product_types!.product_type_id!,
                    name: product.product_types!.name,
                    preparation_time: product.product_types!.preparation_time
                }

            }
        })



})