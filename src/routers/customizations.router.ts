import { prisma } from "../prisma.init";
import { t } from "../trpc/init";

export const customizationsRouter = t.router({

  getAllCustomizations: t.procedure
    // .output(z.promise(z.array(CustomizationQueryResult)))
    .query(async () => {

      const customizations = await prisma.customization_types.findMany({
        include: {
          customization_types_for_product_type: {
            include: {
              product_types: true
            }
          }
        }
      })

      return customizations.map((customization) => {
        return {
          customization_id: customization.customization_id,
          name: customization.name,
          product_types: 
          customization.customization_types_for_product_type.map((customizationPerTypeProduct) => {
            return {
              product_type_id : customizationPerTypeProduct.product_types.product_type_id,
              name: customizationPerTypeProduct.product_types.name,
              preparation_time: customizationPerTypeProduct.product_types.preparation_time
            }
          })
        }
      })
      
    })

})