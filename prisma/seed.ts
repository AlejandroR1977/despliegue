import { Prisma, PrismaClient } from "@prisma/client";
import { hashSHA256Hex } from "../src/utils/hash";
import { ProductCreation, ProductTypeCreation } from "../src/types/Product.type";
import { CustomizationPerProductTypeCreation, CustomizationTypeCreation } from "../src/types/Customizations.type";

const prisma = new PrismaClient()

async function main() {
    if (!await prisma.product_types.count()) {
        await productTypes()
    }

    if (!await prisma.products.count()) {
        await products()
    }

    if (!await prisma.users.count()) {
        console.log('Inserting users')
        await users()
    }

}


async function users() {
    await prisma.users.createMany({
        data: [
            {
                user_id: 1,
                email: 'some_email@email.com',
                role: 'ADMIN',
                username: 'admin',
                phone_number: '6620000000',
                hashed_password: await hashSHA256Hex('contrasena')
            },
            {
                user_id: 2,
                email: 'guest@email.com',
                role: 'GUEST',
                username: 'guest',
                phone_number: '6621111111',
                hashed_password: await hashSHA256Hex('contrasena')

            }
        ]
    })
}
const tiposProducto: ProductTypeCreation[] = [
    { name: 'Hot dogs', preparation_time: 4 },
    { name: 'Papas', preparation_time: 5 },
    { name: 'Ensaladas', preparation_time: 5 },
    { name: 'Hamburguesas', preparation_time: 12 },
    { name: 'Bebidas', preparation_time: 0 },
    { name: 'Dulces', preparation_time: 0 },
    { name: 'Aperitivos', preparation_time: 0 }
]

const customizacionesPorTipo: CustomizationTypeCreation[] = [
    { name: 'Sin tomate' },
    { name: 'Sin lechuga' },
    { name: 'Sin chorizo' },
    { name: 'Sin mayonesa' },
    { name: 'Sin cebolla' },
    { name: 'Sin mantequilla' },
    { name: 'Sin aguacate' }
]

const customizationesPorTipoDeProducto: CustomizationPerProductTypeCreation[] = [
    { customization_type_id: 1, product_type_id: 1 },
    { customization_type_id: 2, product_type_id: 1 },
    { customization_type_id: 3, product_type_id: 1 },
    { customization_type_id: 4, product_type_id: 1 },
    { customization_type_id: 5, product_type_id: 1 },
    { customization_type_id: 1, product_type_id: 2 },
    { customization_type_id: 2, product_type_id: 2 },
    { customization_type_id: 3, product_type_id: 2 },
    { customization_type_id: 4, product_type_id: 2 },
    { customization_type_id: 5, product_type_id: 2 },
    { customization_type_id: 1, product_type_id: 3 },
    { customization_type_id: 2, product_type_id: 3 },
    { customization_type_id: 3, product_type_id: 3 },
    { customization_type_id: 4, product_type_id: 3 },
    { customization_type_id: 5, product_type_id: 3 },
    { customization_type_id: 1, product_type_id: 4 },
    { customization_type_id: 2, product_type_id: 4 },
    { customization_type_id: 4, product_type_id: 4 },
    { customization_type_id: 5, product_type_id: 4 },
    { customization_type_id: 6, product_type_id: 4 },
    { customization_type_id: 7, product_type_id: 4 }
]

const dogos: ProductCreation[] = [
    {
        type: 1,
        name: 'Sencillo',
        description: 'Un winnie rosarito',
        price: 40,
    },
    {
        type: 1,
        name: 'Doble',
        description: 'Dos winnie rosarito',
        price: 45,
    },
    {
        type: 1,
        name: 'Sencillo con papas',
        description: 'Un winnie rosarito y papas a un lado',
        price: 50,
    },
    {
        type: 1,
        name: 'Doble con papas',
        description: 'Un winnie rosarito y papas a un lado',
        price: 55,
    },
    {
        type: 1,
        name: 'Jumbo',
        description: 'Un winisote jumbo envuelto en tocino',
        price: 45,
    },
    {
        type: 1,
        name: 'Jumbo con papas',
        description: 'Un winisote jumbo envuelto en tocino con papas',
        price: 55,
    },
    {
        type: 1,
        name: 'Momia',
        description: 'Un winisote con tortilla envuelto en tocino',
        price: 50,
    },
    {
        type: 1,
        name: 'Jumbo momia con papas',
        description: 'Un winisote con tortilla envuelto en tocino con papas',
        price: 60,
    },
    {
        type: 1,
        name: 'Hungaro',
        description: 'Un winisote envuelto en chile verde y tocino',
        price: 55,
    },
    {
        type: 1,
        name: 'Hungaro con papas',
        description: 'Un winisote envuelto en chile verde y tocino con papas',
        price: 65,
    }
]

const salchipapas: ProductCreation[] = [
    {
        type: 2,
        name: "Salchipapas sencilla",
        description: "Orden de papas con salchicha del tipo seleccionado con tomate, chorizo, lechuga por defecto",
        price: 50,
    },
    {
        type: 2,
        name: "Salchipapas doble",
        description: "Orden de papas con salchicha del tipo seleccionado con tomate, chorizo, lechuga por defecto",
        price: 55,
    },
    {
        type: 2,
        name: "Salchipapas jumbo",
        description: "Orden de papas con salchicha del tipo seleccionado con tomate, chorizo, lechuga por defecto",
        price: 55,
    },
    {
        type: 2,
        name: "Salchipapas momia",
        description: "Orden de papas con salchicha del tipo seleccionado con tomate, chorizo, lechuga por defecto",
        price: 60,
    },
    {
        type: 2,
        name: "Salchipapas húngaro",
        description: "Orden de papas con salchicha del tipo seleccionado con tomate, chorizo, lechuga por defecto",
        price: 65,
    },

]

const hamburguesas: ProductCreation[] = [
    {
        type: 4,
        name: "Sencilla",
        description: "Pan con ajonjolí, tomate, cebolla y aguacate",
        price: 75,
    },
    {
        type: 4,
        name: "Doble",
        description: "Pan con ajonjolí, tomate, cebolla, aguacate y doble carne",
        price: 85,
    },
    {
        type: 4,
        name: "Mexicana",
        description: "Pan con ajonjolí, tomate, cebolla, aguacate, tocino y chile verde",
        price: 85,
    },
    {
        type: 4,
        name: "Arrachera",
        description: "Pan con ajonjolí, tomate, cebolla, aguacate y carne arrachera",
        price: 85,
    },
]

const ensaladas: ProductCreation[] = [
    {
        type: 3,
        name: "Ensalada sencilla",
        description: "400g",
        price: 40,
    },
    {
        type: 3,
        name: "Ensalada jumbo",
        description: "Salchicha del tipo seleccionado picada con tomate, chorizo, lechuga, mayonesa y cebolla por defecto",
        price: 45,
    },
    {
        type: 3,
        name: "Ensalada momia",
        description: "Salchicha del tipo seleccionado picada con tomate, chorizo, lechuga, mayonesa y cebolla por defecto",
        price: 50,
    },
    {
        type: 3,
        name: "Ensalada húngara",
        description: "Salchicha del tipo seleccionado picada con tomate, chorizo, lechuga, mayonesa y cebolla por defecto",
        price: 55,
    }
]

const salchichasYEnrrollados: ProductCreation[] = [
    {
        type: 7,
        name: "Salchicha sencilla",
        description: "Salchicha del tipo seleccionado",
        price: 10,
    },
    {
        type: 7,
        name: "Salchicha jumbo",
        description: "Salchicha del tipo seleccionado",
        price: 25,
    },
    {
        type: 7,
        name: "Salchicha momia",
        description: "Salchicha del tipo seleccionado",
        price: 30,
    },
    {
        type: 7,
        name: "Salchicha húngara",
        description: "Salchicha del tipo seleccionado",
        price: 40,
    },
    {
        type: 7,
        name: "Chile relleno",
        description: "Chile toreado envuelto en tocino y relleno de quesito chihuahua 🫦",
        price: 25,
    }
]

const papas: ProductCreation[] = [
    {
        type: 2,
        name: "Media orden de papas",
        description: "150g de papas",
        price: 30,
    },
    {
        type: 2,
        name: "Orden de papas",
        description: "350g de papas",
        price: 40,
    }

]

const refrescos: ProductCreation[] = [
    {
        type: 5,
        name: "Coca-Cola de vidrio",
        description: "500 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Fanta naranja vidrio",
        description: "500 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Sprite vidrio",
        description: "500 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Coca-Cola plástico",
        description: "600 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Fanta naranja plástico",
        description: "600 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Sprite plástico",
        description: "600 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Coca-Cola plástico",
        description: "400 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Fanta naranja plástico",
        description: "400 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Sprite plástico",
        description: "400 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Arizona",
        description: "680 ml",
        price: 25,
    },
    {
        type: 5,
        name: "Fuze Tea",
        description: "500 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Bida",
        description: "500 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Bida",
        description: "250 ml",
        price: 20,
    },
    {
        type: 5,
        name: "Horchata",
        description: "1 L",
        price: 20,
    },
    {
        type: 5,
        name: "PowerAde",
        description: "600 ml",
        price: 20,
    },
    {
        type: 5,
        name: "PowerAde",
        description: "1 L",
        price: 20,
    },
    {
        type: 5,
        name: "Agua",
        description: "1 L",
        price: 20,
    }





]

async function productTypes() {
    console.log('Inserting product types')
    await prisma.product_types.createMany({
        data: tiposProducto
    })
    console.log('Product types inserted')


    console.log('Inserting customization types')
    await prisma.customization_types.createMany({
        data: customizacionesPorTipo
    })
    console.log('Customization types inserted')

    console.log('Inserting customizations per product type')
    await prisma.customization_types_for_product_type.createMany({
        data: customizationesPorTipoDeProducto
    })
    console.log('Customizations per product types inserted')
}


async function products() {

    const products = [
        ...dogos,
        ...salchipapas,
        ...hamburguesas,
        ...ensaladas,
        ...salchichasYEnrrollados,
        ...papas,
        ...refrescos
    ]

    console.log('Inserting products')
    await prisma.products.createMany({
        data: products
    })
    console.log('Products inserted')
}


main()
