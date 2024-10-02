import { Prisma} from "@prisma/client";
import { prisma } from "../../src/prisma.init";

export const userExtension = Prisma.defineExtension({
  name: 'user',
  model: {
    
    users: {
      getUserById: async (id: number | bigint | string) => {
        let parsedValue = id

        if(typeof parsedValue != 'bigint')
          parsedValue = BigInt(parsedValue)

          const user = await prisma.users.findFirst({where: {user_id: parsedValue}})
        
          return user
      }
    }
  }
})