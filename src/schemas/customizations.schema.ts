import { z } from "zod";
import { TypeProductQuerySchema } from "./typeProduct.schema";

export const CustomizationQueryResult = z.object({
  customization_id: z.number(),
  name: z.string(),
  product_types: z.array(TypeProductQuerySchema)
})