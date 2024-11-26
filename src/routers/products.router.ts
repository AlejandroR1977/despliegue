import { t } from '../trpc/init'
import { prisma } from '../prisma.init'
import { z } from 'zod'
import { ProductCreationSchema, ProductEditionSchema, ProductQueryResult } from '../schemas/products.schema'
import { validProductIdMiddleware, validProductTypeMiddleware } from '../middlewares/products.middleware'
import { authMiddleware } from '../middlewares/auth.middleware'


export const productsRouter = t.router({
    getProducts: t.procedure
        // .output(z.promise(z.array(ProductQueryResult)))
        .use(authMiddleware)
        .query(async ({ ctx }) => {

            const whereStatement: { deleted: false, available?: true } = { deleted: false }

            if (ctx.user.role != 'ADMIN') whereStatement.available = true

            const products = await prisma.products.findMany({
                where: whereStatement,
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
                    available: product.available!,
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
                available: product.available!,
                type: {
                    product_type_id: product.product_types!.product_type_id!,
                    name: product.product_types!.name,
                    preparation_time: product.product_types!.preparation_time
                }

            }
        }),

    createProduct: t.procedure
        .input(ProductCreationSchema)
        .use(validProductTypeMiddleware)
        .output(z.promise(ProductQueryResult.or(z.null())))
        .mutation(async ({ input, ctx }) => {


            const newProduct = await prisma.products.create({
                data: {
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    product_types: {
                        connect: {
                            product_type_id: input.type
                        }
                    },
                    image_path: input.image_path
                }
            })

            return {
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                product_type_id: newProduct.type!,
                image_path: newProduct.image_path,
                product_id: newProduct.product_id.toString(),
                available: newProduct.available!,
                type: {
                    name: ctx.productType.name,
                    product_type_id: ctx.productType.product_type_id,
                    preparation_time: ctx.productType.preparation_time
                }
            }

        }),

    updateProduct: t.procedure
        .input(ProductEditionSchema)
        .use(validProductTypeMiddleware)
        .use(validProductTypeMiddleware)
        .use(validProductIdMiddleware)
        .output(z.promise(ProductQueryResult.or(z.null())))
        .mutation(async ({ input, ctx }) => {
            const productId = BigInt(input.product_id)
            const updatedProduct = await prisma.products.update({
                data: {
                    name: input.name,
                    description: input.description,
                    image_path: input.image_path,
                    price: input.price,
                    type: ctx.productType.product_type_id
                },
                where: {
                    product_id: productId
                }
            })

            return {
                name: updatedProduct.name,
                description: updatedProduct.description,
                price: updatedProduct.price,
                type: ctx.productType,
                image_path: updatedProduct.image_path,
                product_id: updatedProduct.product_id.toString(),
                available: updatedProduct.available!,
                product_type_id: updatedProduct.type!
            }
        }),

    changeProductState: t.procedure
        .input(z.object({ product_id: z.string().or(z.number()), available: z.boolean() }))
        .use(validProductIdMiddleware)
        .mutation(async ({ ctx, input }) => {
            const product = await prisma.products.update({ data: { available: input.available }, where: { product_id: ctx.product.product_id } })
            const productType = await prisma.product_types.findFirst({ where: { product_type_id: ctx.product.type! } })
            return {
                name: product.name,
                description: product.description,
                price: product.price,
                type: productType,
                image_path: product.image_path,
                product_id: product.product_id.toString(),
                available: product.available!,
                product_type_id: product.type!
            }
        }),

    deleteProduct: t.procedure
        .input(z.object({ product_id: z.string().or(z.number()) }))
        .use(validProductIdMiddleware)
        .output(z.promise(ProductQueryResult.or(z.null())))
        .mutation(async ({ ctx }) => {
            const deletedProduct = await prisma.products.update({
                where: {
                    product_id: ctx.product.product_id
                },
                data: {
                    deleted: true
                },
                include: {
                    product_types: true
                }
            })

            return {
                name: deletedProduct.name,
                description: deletedProduct.description,
                price: deletedProduct.price,
                type: deletedProduct.product_types!,
                image_path: deletedProduct.image_path,
                product_id: deletedProduct.product_id.toString(),
                available: deletedProduct.available!,
                product_type_id: deletedProduct.type!
            }
        })

})