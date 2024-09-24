import { z } from "zod";

const customizations =   ['TOMATE','LECHUGA','MAYONESA','CEBOLLA','CHORIZO'] as const

const orderStatus =   ['PENDING','IN_PROCESS','READY','DELIVERED','CANCELED'] as const

export const CreateOrderSchema = z.object({
    user_id: z.number().or(z.bigint()),
    order_date: z.date().or(z.string()),
    pickup_time: z.date().or(z.string()),
    items: z.array(z.object({
        price_at_time_of_order: z.number(),
        quantity: z.number().int('quantity must be an integer'),
        product_id: z.number().int('product id must be an integer'),
        customizations: z.optional(z.array(z.enum(customizations)))
    }))

})

export const FindOrderSchema = z.object({
    status: z.optional(z.enum(orderStatus)),
    include: z.array(z.enum(['USERS','ORDER_ITEMS'])).default(['USERS', 'ORDER_ITEMS'])

})

export const QueryOrderResult = z.object({
    order_id: z.string(),
    items: CreateOrderSchema.shape.items,
    order_date: CreateOrderSchema.shape.order_date,
    pickup_time: CreateOrderSchema.shape.pickup_time
})
