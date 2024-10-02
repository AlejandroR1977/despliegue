import { prisma } from "../../../prisma.init";
import { SingleItemEvaluationError } from "../errors/ItemEvaluationError";
import { SingleItemEvaluation } from "../OrderItemsEvaluator";

export const isExistentProduct: SingleItemEvaluation = {
  async eval(item) {
      const product = await prisma.products.getProductById(item.product_id)

      if(!product) throw new SingleItemEvaluationError('Specified product_id doesnt exist', item, 'product_id', 'resource_not_found')

      
  }
}