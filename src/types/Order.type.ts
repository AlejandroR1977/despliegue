import { z } from "zod";
import { CreateItemSchema } from "../schemas/orders.schema";

export type OrderItemCreation = z.infer<typeof CreateItemSchema>