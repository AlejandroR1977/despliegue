import { Prisma } from "@prisma/client";


export const ordersExtension = Prisma.defineExtension({
  model: {
    orders: {
      getWholeOrderInclude() {
        return {
          order_items: {
            include: {
              products: {
                include: {
                  product_types: true,
                }
              },
              item_customizations: {
                include: {
                  customization_types: true
                }
              }
            }
          },
          users: true
        }
      },
    }
  }
})