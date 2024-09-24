import z from 'zod'

export const typeProducts = ['BEBIDAS', 'DOGOS', 'DULCES', 'ENSALADAS', 'HAMBURGUESAS', 'PAPAS'] as const

export const TypeProductSchema = z.enum(typeProducts)
