class Recipe {
  constructor(recipe) {
    this.name = recipe.name;
    this.id = recipe.id;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
    this.tags = recipe.tags;
    this.image = recipe.image;
  }

  getIngredientsInfo(ingredientsData) {
    this.ingredients = this.ingredients.map(ingredient => {
      let ingredientData = ingredientsData.ingredientsData.find(item => {
        return item.id === ingredient.id;
      })
      ingredient.name = ingredientData.name;
      ingredient.estimatedCostInCents = ingredientData.estimatedCostInCents;
      return ingredient
    })
  }

  calculateTotalRecipeCost() {
    let costCounter = 0;
    this.ingredients.map(ingredient => {
      costCounter += Math.floor(ingredient.estimatedCostInCents * ingredient.quantity.amount)
    })
    return costCounter/100;
  }
}

export default Recipe;
