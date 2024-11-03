import { z } from "zod";
//import { CustomizationQueryResult } from "./customizations.schema";


const orderStatus = ['PENDING', 'IN_PROCESS', 'READY', 'DELIVERED', 'CANCELED'] as const

export const CreateItemSchema = z.object({
    quantity: z.number().int('quantity must be an integer'),
    product_id: z.number().int('product id must be an integer'),
    customizations: z.optional(z.array(z.number().int('customization id is an int')))
})

export const CreateOrderSchema = z.object({
    user_id: z.preprocess((val) => {
        if (typeof val == 'string') {
            return BigInt(val)
        }
        return val
    }, z.bigint()),
    order_time: z.date().or(z.string()),
    pickup_time: z.date().or(z.string()),
    items: z.array(CreateItemSchema)

})



export const StatusOrderSchema = z.object({
    status: z.optional(z.enum(orderStatus)),
})



export const QueryOrderResultWithItems = z.object({
    order_id: z.string(),
    status: z.string(),
    total_amount: z.number(),
    order_time: z.string().or(z.date()),
    pickup_time: z.string().or(z.date()),
    user: z.object({
        user_id: z.string(),
        username: z.string(),
        email: z.string(),
        role: z.string(),
        phone_number: z.string()
    }),
    items: z.array(z.object({
        order_item_id: z.number(),
        price_at_time_of_order: z.number(),
        quantity: z.number(),
        product_name: z.string(),
        product_id: z.string(),
        product_type: z.string(),
        product_type_id: z.number(),
        customizations: z.object({
            customization_id: z.number(),
            name: z.string()
        })
    }))
})

export const QueryOrderResultWithItemsArray = z.array(QueryOrderResultWithItems)