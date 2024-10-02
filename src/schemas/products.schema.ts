import { z } from "zod";
import { TypeProductQuerySchema } from "./typeProduct.schema";

export const ProductQueryOptions = z.enum(['MINIMAL', 'LONG'])

export const ProductMinimalQueryResult = z.object({
  product_id: z.string(),
  name: z.string(),
  description: z.string().or(z.null()),
  price: z.number(),
  product_type_id: z.number(),
  image_path: z.string().or(z.null())
})

export const ProductQueryResult = z.object({
  ...ProductMinimalQueryResult.shape,
  type: TypeProductQuerySchema
})

