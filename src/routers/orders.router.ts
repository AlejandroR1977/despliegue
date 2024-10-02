import { t } from '../trpc/init'
import { prisma } from '../prisma.init'
import { CreateOrderSchema, StatusOrderSchema } from '../schemas/orders.schema'
import { TRPCError } from '@trpc/server'
import { OrderItemEvaluator } from '../orders/order_items_evaluation/OrderItemsEvaluator'
import { areValidCustomizations } from '../orders/order_items_evaluation/evaluators/areValidCustomizations'
import { isExistentProduct } from '../orders/order_items_evaluation/evaluators/isExistentProduct'
import { SingleItemEvaluationError } from '../orders/order_items_evaluation/errors/ItemEvaluationError'
import { mergeRepeatedCustomizations } from '../orders/order_items_evaluation/transformers/mergeRepeatedCustomizations'
import { toSalchichaIfEnsaladaDoesNotContainAnything } from '../orders/order_items_evaluation/transformers/toSalchichaIfEnsaladaDoesNotContainAnything'
import { getOrderMiddleware } from '../orders/middlewares/getOrder.middleware'
import { z } from 'zod'



export const ordersRouter = t.router({
    addNewOrder: t.procedure.input(
        CreateOrderSchema
    )
        .mutation(async ({ input }) => {

            const user = await prisma.users.getUserById(input.user_id)

            if(!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Non existent user',
                    cause: 'user_id'
                })
            }

            const orderItemEvaluator = new OrderItemEvaluator(input.items)
            orderItemEvaluator.addSingleEvaluation(isExistentProduct)
            orderItemEvaluator.addSingleEvaluation(areValidCustomizations)
            orderItemEvaluator.addSetTransformation(mergeRepeatedCustomizations)
            orderItemEvaluator.addSingleTransformation(toSalchichaIfEnsaladaDoesNotContainAnything)
            try {
                await orderItemEvaluator.eval()


                let totalAmount = 0
                let pickupTime = 0

                let parsedItems = []
                const orderDate = new Date(input.order_time)

                for (let i = 0; i < orderItemEvaluator.items.length; i++) {
                    const product = await prisma.products.findFirst({
                        where: {
                            product_id: orderItemEvaluator.items[i].product_id
                        },
                        include: {
                            product_types: true
                        }
                    })

                    totalAmount += product!.price
                    pickupTime += product!.product_types!.preparation_time

                    parsedItems.push({
                        date_time: orderDate,
                        order_item_id: i + 1,
                        price_at_time_of_order: product!.price,
                        quantity: orderItemEvaluator.items[i].quantity,
                        product_id: orderItemEvaluator.items[i].product_id,
                        item_customizations: {
                            create: orderItemEvaluator.items[i].customizations?.map((customization_type_id) => ({customization_type_id}))
                        }
                    })

                }
                const pickupDate = new Date(input.order_time)
                pickupDate.setMinutes(pickupDate.getMinutes() + pickupTime)

                
                const order = await prisma.orders.create({
                    data: {
                        order_time: orderDate,
                        pickup_time: pickupDate,
                        user_id: input.user_id,
                        total_amount: totalAmount,
                        order_items: {
                            create: parsedItems
                        }
                    }
                })

                const orderString = JSON.stringify(order, ( index, value) => {
                    if (typeof value == 'bigint'){
                        index
                        return value.toString()
                    }
                    return value
                },2)



                return JSON.parse(orderString)
                
            } catch (error) {

                console.error(error)
                
                if (error instanceof SingleItemEvaluationError){
                    let code: ConstructorParameters<typeof TRPCError>[0]['code']

                    switch(error.type){
                        case 'resource_not_found':
                            code = 'NOT_FOUND'
                        break;
                        case 'inconsistent':
                            code = 'CONFLICT'
                        break;
                        default:
                            code = 'UNPROCESSABLE_CONTENT'
                    }
                    
                    
                    throw new TRPCError({
                        code,
                        message: `${error.key} - ${error.message}`
                    })
                }

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        

        }),
        getOrdersWithItems: t.procedure
            .input(z.object({
                status: StatusOrderSchema.shape.status.or(z.literal('all'))
            }))
            // .output(z.promise(QueryOrderResultWithItemsArray))
            .query(async ({input}) => {
                const include = prisma.orders.getWholeOrderInclude()

                const orders = await prisma.orders.findMany({
                    where: input.status != 'all' ? {
                        status: input.status
                    }: undefined,
                    include
                })
                
                
                const parsedOrders = orders.map(order => {
                    return {
                        order_id: order.order_id.toString(),
                        status: order.status,
                        total_amount: order.total_amount,
                        order_time: order.order_time,
                        pickup_time: order.pickup_time,
                        cc_datetime: order.cc_datetime,
                        user: {
                            user_id: order.user_id.toString(),
                            username: order.users.username,
                            email: order.users.email,
                            role: order.users.role,
                            phone_number: order.users.phone_number
                        },
                        items: order.order_items.map(item =>{
                            return {
                                order_item_id: item.order_item_id,
                                price_at_time_of_order: item.price_at_time_of_order,
                                quantity: item.quantity,
                                product_name: item.products!.name,
                                product_id: item.product_id!.toString(),
                                product_type: item.products!.product_types!.name,
                                product_type_id: item.products!.product_types!.product_type_id,
                                customizations: item.item_customizations.map((customization) => {
                                    return {
                                        customization_id: customization.customization_types!.customization_id,
                                        name: customization.customization_types!.name
                                    }
                                })
                            }
                        })
                    }
                })

                

                return parsedOrders
            }),
        
        changeOrderStatus: t.procedure
            .input(z.object({
                order_id: z.string().or(z.number().int()),
                status: StatusOrderSchema.shape.status
            }))
            .use(getOrderMiddleware)
            .mutation(async ({ctx, input}) => {
                let order = ctx.order
                if(input.status != ctx.order.status){
                    await prisma.orders.update({
                        where: {
                            order_id: order.order_id
                        },
                        data: {
                            status: input.status
                        }
                    })
                }

                if(!ctx.order.cc_datetime){
                    await prisma.orders.update({
                        where: {
                            order_id: order.order_id
                        },
                        data: {
                            cc_datetime: new Date()
                        }
                    })
                }

                return input.status
            })
})
