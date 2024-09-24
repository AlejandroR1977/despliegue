import { t } from '../trpc/init'
import { prisma } from '../prisma.init'
import { CreateOrderSchema, FindOrderSchema } from '../schemas/orders.schema'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'



export const ordersRouter = t.router({
    addNewOrder: t.procedure.input(
        CreateOrderSchema
    )
        .mutation(async ({ input }) => {

            const totalOrderAmount = input.items.reduce((prev, curr) => {

                return prev + (curr.price_at_time_of_order * curr.quantity)
            },0)


            
            try {
                const order = await prisma.orders.create({
                    data: {
                        user_id: input.user_id,
                        order_date: input.order_date,
                        pickup_time: input.pickup_time,
                        total_amount: totalOrderAmount,
                        
                        
                        order_items: {
                            create: [
                                ...input.items.map((item, index) => {
              
                                    return (
                                        {
                                            order_item_id: index,
                                            price_at_time_of_order: item.price_at_time_of_order,
                                            quantity: item.quantity,
                                            product_id: item.product_id,
                                            customizations: {
                                                create: item.customizations?.map((customization) => ({customization}))
                                            }
                                        }
                                    )

                                }),

                            ]
                        }
                    }
                })
                return order
            } catch (error) {

                if(error instanceof PrismaClientKnownRequestError){
                    return {
                        error: 'Invalid data',
                        field: error.meta?.field_name
                    }
                }
                
                return error
            }

        }),
        getOrders: t.procedure
            .input(FindOrderSchema)
            .query(async ({input}) => {

            const include = {
                order_items: {
                    include: {
                        products: true,
                        customizations: true
                    }
                },
                users: true
            }

            let result
            
            if(input.status){
                result = await prisma.orders.findMany({
                    where: {status: input.status},
                    include
                })
            }
            else {
                result = await prisma.orders.findMany({
                    include
                })
            }

            const parsedResults = result.map((order) => {
                return {
                    ...order,
                    order_id: order.order_id.toString(),
                    user_id: order.user_id.toString(),
                    order_items: order.order_items.map((item) => {
                        return {
                            ...item,
                            order_id: item.order_id.toString(),
                            product_id: item.product_id?.toString(),
                            customizations: item.customizations.map(customization => customization.customization),
                            products: {
                                ...item.products,
                                product_id: item.products?.product_id.toString()
                            }
                        }
                    }),
                    users: {
                        ...order.users,
                        user_id: order.user_id.toString()
                    }
                }
            })

            return parsedResults
        })
})
