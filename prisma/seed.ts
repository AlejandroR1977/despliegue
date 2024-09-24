import { Prisma, PrismaClient } from "@prisma/client";
import { hashSHA256Hex } from "../src/utils/hash";
import { ProductCreation } from "../src/types/Product.type";

const prisma = new PrismaClient()

async function main (){
    if(! await prisma.products.count() && process.env.MODE != 'PROD'){
        console.log('Inserting products')
        await products()
    }

    if (! await prisma.users.count()) {
        console.log('Inserting users')
        await users()
    }
    
} 


async function users(){
    await prisma.users.create({data: {
        user_id: 1,
        email: 'some_email@email.com',
        role: 'ADMIN',
        username:'admin',
        phone_number: '6620000000',
        hashed_password: await hashSHA256Hex('contrasena')
    }})
}


const dogos: ProductCreation[] = [
    {
        type: "DOGOS",
        name: 'Sencillo',
        description: 'Un winnie rosarito',
        price: 40,
    },
    {
        type: "DOGOS",
        name: 'Doble',
        description: 'Dos winnie rosarito',
        price: 45,
    },
    {
        type: "DOGOS",
        name: 'Sencillo con papas',
        description: 'Un winnie rosarito y papas a un lado',
        price: 50,
    },
    {
        type: "DOGOS",
        name: 'Doble con papas',
        description: 'Un winnie rosarito y papas a un lado',
        price: 55,
    },
    {
        type: "DOGOS",
        name: 'Jumbo',
        description: 'Un winisote jumbo',
        price: 45,
    },
    {
        type: "DOGOS",
        name: 'Jumbo con papas',
        description: 'Un winisote jumbo con papas',
        price: 55,
    },
    {
        type: "DOGOS",
        name: 'Momia',
        description: 'Un winisote con tortilla',
        price: 50,
    },
    {
        type: "DOGOS",
        name: 'Jumbo momia con papas',
        description: 'Un winisote con tortilla y papas',
        price: 60,
    },
    {
        type: "DOGOS",
        name: 'Hungaro',
        description: 'Un winisote con tortilla y papas',
        price: 55,
    },
    {
        type: "DOGOS",
        name: 'Hungaro con papas',
        description: 'Un winisote con tortilla y papas',
        price: 65,
    }
]

const salchipapas: ProductCreation[] = [
    {
        type: "PAPAS",
        name: "Salchipapas sencilla",
        description: "400g",
        price: 50,
    },
    {
        type: "PAPAS",
        name: "Salchipapas doble",
        description: "400g",
        price: 55,
    },
    {
        type: "PAPAS",
        name: "Salchipapas jumbo",
        description: "400g",
        price: 55,
    },
    {
        type: "PAPAS",
        name: "Salchipapas momia",
        description: "400g",
        price: 60,
    },
    {
        type: "PAPAS",
        name: "Salchipapas húngaro",
        description: "400g",
        price: 65,
    },

]

const hamburguesas: ProductCreation[] = [
    {
        type: "HAMBURGUESAS",
        name: "Sencilla",
        description: "Pan con ajonjolí, tomate, cebolla y aguacate",
        price: 75,
    },
    {
        type: "HAMBURGUESAS",
        name: "Doble",
        description: "Pan con ajonjolí, tomate, cebolla, aguacate y doble carne",
        price: 85,
    },
    {
        type: "HAMBURGUESAS",
        name: "Mexicana",
        description: "Pan con ajonjolí, tomate, cebolla, aguacate, frijoles y jalapeño",
        price: 85,
    },
    {
        type: "HAMBURGUESAS",
        name: "Arrachera",
        description: "Pan con ajonjolí, tomate, cebolla, aguacate y carne arrachera",
        price: 85,
    },
]

const ensaladas: ProductCreation[] = [
    {
        type: "ENSALADAS",
        name: "Ensalada sencilla",
        description: "400g",
        price: 40,
    },
    {
        type: "ENSALADAS",
        name: "Ensalada jumbo",
        description: "400g",
        price: 45,
    },
    {
        type: "ENSALADAS",
        name: "Ensalada momia",
        description: "400g",
        price: 50,
    },
    {
        type: "ENSALADAS",
        name: "Ensalada húngara",
        description: "400g",
        price: 55,
    }
]

const salchichasYEnrrollados: ProductCreation[] = [
    {
        type: "DOGOS",
        name: "Salchicha sencilla",
        description: "400g",
        price: 10,
    },
    {
        type: "DOGOS",
        name: "Chile relleno",
        description: "400g",
        price: 25,
    },
    {
        type: "DOGOS",
        name: "Salchicha jumbo",
        description: "400g",
        price: 25,
    },
    {
        type: "DOGOS",
        name: "Salchicha momia",
        description: "400g",
        price: 30,
    },
    {
        type: "DOGOS",
        name: "Salchicha húngara",
        description: "400g",
        price: 40,
    },
]

const papas: ProductCreation[] = [
    {
        type: "PAPAS",
        name: "Media orden de papas",
        description: "400g",
        price: 30,
    },
    {
        type: "PAPAS",
        name: "Orden de papas",
        description: "900g",
        price: 40,
    }

]

const refrescos: ProductCreation[] = [
    {
        type: "BEBIDAS",
        name: "Coca-Cola de vidrio",
        description: "500 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Fanta naranja vidrio",
        description: "500 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Sprite vidrio",
        description: "500 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Coca-Cola plástico",
        description: "600 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Fanta naranja plástico",
        description: "600 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Sprite plástico",
        description: "600 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Coca-Cola plástico",
        description: "400 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Fanta naranja plástico",
        description: "400 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Sprite plástico",
        description: "400 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Arizona",
        description: "680 ml",
        price: 25,
    },
    {
        type: "BEBIDAS",
        name: "Fuze Tea",
        description: "500 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Bida",
        description: "500 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Bida",
        description: "250 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Horchata",
        description: "1 L",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "PowerAde",
        description: "600 ml",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "PowerAde",
        description: "1 L",
        price: 20,
    },
    {
        type: "BEBIDAS",
        name: "Agua",
        description: "1 L",
        price: 20,
    }





]

async function products(){

    const products = [
        ...dogos,
        ...salchipapas,
        ...hamburguesas,
        ...ensaladas,
        ...salchichasYEnrrollados,
        ...papas,
        ...refrescos
    ]

    

    await prisma.products.createMany({
        data: [
            ...products
        ]
    })
}


main()