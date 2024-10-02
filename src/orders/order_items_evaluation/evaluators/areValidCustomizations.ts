import { prisma } from "../../../prisma.init";
import { SingleItemEvaluationError } from "../errors/ItemEvaluationError";
import { SingleItemEvaluation } from "../OrderItemsEvaluator";

export const areValidCustomizations: SingleItemEvaluation = {
  async eval(item) {
      if(!item.customizations) return 

      const product = await prisma.products.getProductById(item.product_id)

      if(!product?.type) return

      const validCustomizations = await prisma.customization_types.getCustomizationsByProductTypeId(product.type)

      for(const customizationId of item.customizations){

        if(!validCustomizations.some(validCustomization => validCustomization.customization_id == customizationId)){
          throw new SingleItemEvaluationError(`Customization ${customizationId} is not applicable on product-${product.product_id}`, item, 'customizations', 'inconsistent')
        }

      }
  }
}