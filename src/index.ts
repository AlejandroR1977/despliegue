import { app } from "./server";
import { PORT } from "./constants"
import { prisma } from "./prisma.init";



(async function () {
    await prisma.$connect()

    app.listen(PORT, () => {
        console.log('Executing on port',PORT)
    })


})()

