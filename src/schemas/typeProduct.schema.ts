import z from 'zod'

export const TypeProductQuerySchema = z.object({
  product_type_id: z.number(),
  name: z.string(),
  preparation_time: z.number()
})