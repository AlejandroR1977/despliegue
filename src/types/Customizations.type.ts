import { prisma } from "../prisma.init";


export type CustomizationTypeCreation = Parameters<typeof prisma.customization_types.create>[number]['data']

export type CustomizationPerProductTypeCreation = Required<Pick<Parameters<typeof prisma.customization_types_for_product_type.create>[0]['data'], 'customization_type_id' | 'product_type_id'>>