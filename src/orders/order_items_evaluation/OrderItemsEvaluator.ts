import { OrderItemCreation } from "../../types/Order.type";



export interface SingleItemEvaluation{
  eval: (item: OrderItemCreation) => Promise<void>
}
export interface ItemSetEvaluation{
  eval: (items: OrderItemCreation[]) => Promise<void>
}

export interface ItemSetTransformation{
  transform: (items: OrderItemCreation[]) => Promise<OrderItemCreation[]>
}

export interface SingleItemTransformation{
  transform: (item: OrderItemCreation) => Promise<OrderItemCreation>
}

export class OrderItemEvaluator{

  public singleItemEvaluators: SingleItemEvaluation[]
  public itemSetEvaluators: ItemSetEvaluation[]
  public itemSetTransformers: ItemSetTransformation[]
  public singleItemTransformers: SingleItemTransformation[]

  constructor(
    public items: OrderItemCreation[]
  ){
    this.singleItemEvaluators = []
    this.itemSetEvaluators = []
    this.itemSetTransformers = []
    this.singleItemTransformers = []
  }

  addSingleEvaluation(evaluation: SingleItemEvaluation){
    this.singleItemEvaluators.push(evaluation)
  }

  addSetEvaluation(evaluation: ItemSetEvaluation){
    this.itemSetEvaluators.push(evaluation)
  }

  addSingleTransformation(transformation: SingleItemTransformation){
    this.singleItemTransformers.push(transformation)
  }

  addSetTransformation(transformation: ItemSetTransformation){
    this.itemSetTransformers.push(transformation)
  }

  async eval(){
    for (const item of this.items) {
      for (const singleItemEvaluation of this.singleItemEvaluators) {
        await singleItemEvaluation.eval(item)
      }
    }

    for (const itemSetEvaluation of this.itemSetEvaluators) {
      await itemSetEvaluation.eval(this.items)
    }

    for (const transformators of this.itemSetTransformers) {
      this.items = await transformators.transform(this.items)
    }

    for (let i = 0; i < this.items.length; i++) {
      for (const singleItemTransformation of this.singleItemTransformers) {
        this.items[i] = await singleItemTransformation.transform(this.items[i])
      }
    }

  }
}