import { z } from "zod";
import { TypeProductQuerySchema } from "./typeProduct.schema";

export const ProductQueryOptions = z.enum(['MINIMAL', 'LONG'])

export const ProductMinimalQueryResult = z.object({
  product_id: z.string(),
  name: z.string(),
  description: z.string().or(z.null()),
  price: z.number(),
  product_type_id: z.number(),
  image_path: z.string().or(z.null()),
  available: z.boolean()
})

export const ProductCreationSchema = z.object({
  name: z.string()
    .min(5, 'El nombre del producto debe tener una longitud minima de 5 caracteres')
    .max(100, 'El nombre del producto debe tener una longitud máxima de 100 caracteres'),
  description: z.optional(z.string().max(512, 'La descripcion debe tener una longitud máxima de 512 caracteres')),
  price: z.number(),
  type: z.number(),
  image_path: z.optional(z.string())
})

export const ProductEditionSchema = z.object({
  ...ProductCreationSchema.shape,
  product_id: z.string().or(z.number())
})

export const ProductQueryResult = z.object({
  ...ProductMinimalQueryResult.shape,
  type: TypeProductQuerySchema
})

