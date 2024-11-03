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
import { authMiddleware } from '../middlewares/auth.middleware'
import { GUEST_TOKEN_KEY, ORDERS_AMOUNT_LIMIT_FOR_NON_ADMINS } from '../constants'
import jwt from 'jsonwebtoken'


export const ordersRouter = t.router({
    addNewOrder: t.procedure
        .use(authMiddleware)
        .input(CreateOrderSchema)
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.users.getUserById(input.user_id)

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Non existent user',
                    cause: 'user_id'
                })
            }

            let updateTokenIfGuest = () => { }

            if (user.role == 'GUEST') {
                let guestToken = ctx.req.cookies[GUEST_TOKEN_KEY]

                if (!guestToken) {
                    guestToken = jwt.sign({
                        ip: ctx.req.ip,
                        timestamp: Date.now(),
                        quantity: 0

                    }, GUEST_TOKEN_KEY)

                }

                const object = jwt.verify(guestToken, GUEST_TOKEN_KEY) as { ip: string, timestamp: Date, quantity: number }

                const lastRequest = new Date(object.timestamp)
                const now = Date.now()

                const diff = now - lastRequest.getTime()
                const hoursInMilliseconds = 1000 * 60 * 60

                if (object.quantity > 1 && diff < hoursInMilliseconds) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                        message: 'No puedes tener mas de 2 pedidos por hora'
                    })
                }

                if (diff > hoursInMilliseconds) {
                    object.quantity = 0
                }


                updateTokenIfGuest = () => {
                    object.quantity++
                    const newToken = jwt.sign(object, GUEST_TOKEN_KEY)
                    ctx.res.cookie(GUEST_TOKEN_KEY, newToken)
                }


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

                    totalAmount += product!.price * orderItemEvaluator.items[i].quantity
                    pickupTime += product!.product_types!.preparation_time

                    parsedItems.push({
                        date_time: orderDate,
                        order_item_id: i + 1,
                        price_at_time_of_order: product!.price,
                        quantity: orderItemEvaluator.items[i].quantity,
                        product_id: orderItemEvaluator.items[i].product_id,
                        item_customizations: {
                            create: orderItemEvaluator.items[i].customizations?.map((customization_type_id) => ({ customization_type_id }))
                        }
                    })

                }
                const pickupDate = new Date(input.order_time)
                pickupDate.setMinutes(pickupDate.getMinutes() + pickupTime)


                if (user.role != 'ADMIN' && totalAmount > ORDERS_AMOUNT_LIMIT_FOR_NON_ADMINS) {
                    throw new TRPCError({
                        message: 'No puedes comprar más de $2000',
                        code: 'UNAUTHORIZED'
                    })
                }


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

                const orderString = JSON.stringify(order, (_, value) => {
                    if (typeof value == 'bigint') {
                        return value.toString()
                    }
                    return value
                }, 2)

                updateTokenIfGuest()

                return JSON.parse(orderString)

            } catch (error) {


                if (error instanceof SingleItemEvaluationError) {
                    let code: ConstructorParameters<typeof TRPCError>[0]['code']

                    switch (error.type) {
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

                if (error instanceof TRPCError) {
                    throw error
                }

                console.error(error)
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }


        }),
    getOrdersWithItems: t.procedure
        .use(authMiddleware)
        .input(z.object({
            status: StatusOrderSchema.shape.status.or(z.literal('all'))
        }))
        .query(async ({ input, ctx }) => {
            const include = prisma.orders.getWholeOrderInclude()
            const user = ctx.user
            const withUserId = (user.role == 'ADMIN' ? {} : { user_id: Number(user.user_id) })

            const withStatus = (input.status == 'all' ? {} : { status: input.status })

            const orders = await prisma.orders.findMany({
                where: {
                    ...withStatus,
                    ...withUserId
                },
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
                    items: order.order_items.map(item => {
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
        .use(authMiddleware)
        .use(getOrderMiddleware)
        .mutation(async ({ ctx, input }) => {

            if (ctx.user.role != 'ADMIN') {
                throw new TRPCError({
                    code: 'UNAUTHORIZED'
                })
            }



            let order = ctx.order
            if (input.status != ctx.order.status) {
                await prisma.orders.update({
                    where: {
                        order_id: order.order_id
                    },
                    data: {
                        status: input.status
                    }
                })
            }

            if (!ctx.order.cc_datetime) {
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
