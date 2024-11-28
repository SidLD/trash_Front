export interface FoodWasteData {
    _id: string
    dateOfWaste: string
    foodCategory: string[]
    dishesWasted: string[]
    quantity: number
    cost: number
    reasonForWaste: string[]
    notableIngredients: string[]
    temperature: 'hot' | 'normal' | 'cold' | "didn't notice"
    mealType: string
    wasteStage: string
    preventable: string
    disposalMethod: string
    environmentalConditions: string
    relevantEvents: string
    otherRelevantEvents: string
    additionalComments: string
    status: string
    userId: {
      _id: string
      username: string
      firstName: string
      lastName: string
      email: string
      role: string
      status: string
    }
    createdAt: string
    updatedAt: string
  }