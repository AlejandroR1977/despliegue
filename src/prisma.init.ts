import { PrismaClient } from "@prisma/client";
import { userExtension } from "../prisma/extensions/users.extension";
import { productsExtension } from "../prisma/extensions/products.extension";
import { customizationsExtension } from "../prisma/extensions/customizations.extension";
import { ordersExtension } from "../prisma/extensions/orders.extension";

export const prisma = new PrismaClient()
  .$extends(userExtension)
  .$extends(productsExtension)
  .$extends(ordersExtension)
  .$extends(customizationsExtension);
