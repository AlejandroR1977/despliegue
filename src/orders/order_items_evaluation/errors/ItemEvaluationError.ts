import { OrderItemCreation } from "../../../types/Order.type"

export class SingleItemEvaluationError extends Error {

  constructor(
    public message: string, 
    public item: OrderItemCreation, 
    public key: keyof typeof item,
    public type: 'inconsistent' | 'resource_not_found'
  ){
    super(message)
  }
}