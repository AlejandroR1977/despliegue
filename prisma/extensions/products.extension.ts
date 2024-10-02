import { Prisma } from "@prisma/client";
import { prisma } from "../../src/prisma.init";

export const productsExtension = Prisma.defineExtension({
  name: 'products',
  model: {
    products: {
      getProductById: async (id: string | number | bigint) => {
        let parsedId = id
        if(typeof parsedId != 'bigint'){
          parsedId = BigInt(parsedId)
        }

        const product = await prisma.products.findFirst({where: {product_id: parsedId}})

        return product
      }
    }
  }
})