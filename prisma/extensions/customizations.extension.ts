import { Prisma } from "@prisma/client";
import { prisma } from "../../src/prisma.init";

export const customizationsExtension = Prisma.defineExtension({
  name: 'customization_types',
  model: {
    customization_types: {
      getCustomizationById: async (id: number) => {

        const product = await prisma.customization_types.findFirst({ where: { customization_id: id }, include: { customization_types_for_product_type: true } })

        return product
      },

      getCustomizationsByProductTypeId: async (productTypeId: number) => {
        const customizations = await prisma.customization_types_for_product_type.findMany({
          where: {
            product_type_id: productTypeId
          },
          include: {
            customization_types: true
          }
        })

        return customizations.map(customization => {
          return customization.customization_types
        })
      },

      getCustomizationsByProductId: async (productId: number | string | bigint) => {

        const product = await prisma.products.getProductById(productId)


        if (!product?.type) return []

        const customizations = await prisma.customization_types.getCustomizationsByProductTypeId(product.type)

        return customizations
      }
    },

  }
})