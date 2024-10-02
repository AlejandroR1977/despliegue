import { prisma } from "../../../prisma.init";
import { SingleItemTransformation } from "../OrderItemsEvaluator";

export const toSalchichaIfEnsaladaDoesNotContainAnything: SingleItemTransformation = {
  async transform(item) {
    const product = await prisma.products.findFirst({
      where: {
        product_id: item.product_id
      },
      include: {
        product_types: true
      }
    })
    
    if(!product || !product.type) return item
    
    if (product.type != 3) return item
    
    const availableCustomizationsHash = (await prisma.customization_types.getCustomizationsByProductTypeId(product.type)).map((cus => (cus.customization_id))).join(',')

    const customizationsHash = item.customizations? item.customizations.join(',') : ''
    if (availableCustomizationsHash != customizationsHash) return item

    const tipoSalchicha = product.name.split(' ')[1]

    const salchicha = await prisma.products.findFirst({
      where: {
        type: 7,
        name: {
          endsWith: tipoSalchicha
        }
      }
    })

    if(!salchicha) return item

    const newItem = {product_id: Number( salchicha.product_id), quantity: item.quantity, customizations: []}


    return newItem
  }
}