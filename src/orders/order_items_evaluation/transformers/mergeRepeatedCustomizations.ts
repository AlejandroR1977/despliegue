import { ItemSetTransformation } from "../OrderItemsEvaluator";
function hashItem(productId: number, customizations?: number[]){
  let customizationsString = ''
  
  if (customizations)
    customizationsString = customizations.sort().join(',')
  
  return `${productId} - (${customizationsString})`
}

export const mergeRepeatedCustomizations: ItemSetTransformation= {
  
  async transform(items) {

    const repeatedIndexes: number[] = []

    const repeatedItems = items.filter((item, index) => {
      const repeated = items.filter((secondItem) => {
        return hashItem(item.product_id, item.customizations) == hashItem(secondItem.product_id, secondItem.customizations)
      })
      if(repeated.length > 1){
        repeatedIndexes.push(index)
        repeatedIndexes.push()

        return true
      }
    })

    const notRepeatedItems = items.filter((_, index) => !repeatedIndexes.includes(index))

    const mergedItems = repeatedItems.reduce<typeof items>((acc, curr) => {

      const searchedRepeatedItem = acc.find(item => item.product_id == curr.product_id)

      if(!searchedRepeatedItem)
        acc.push(curr)

      else {
        searchedRepeatedItem.quantity += curr.quantity
      }

      return acc
    }, [])

    
    const finalItems = [...notRepeatedItems, ...mergedItems]
    
    return finalItems
  }
}