import { prisma } from "../prisma.init";



export type ProductTypeCreation = Parameters<typeof prisma.product_types.create>[number]['data']

export type ProductCreation = Parameters<typeof prisma.products.create>[number]['data']
export type ProductInstance = Awaited<ReturnType<typeof prisma.products.findFirst>>
export type ProductType = ProductCreation['type']

