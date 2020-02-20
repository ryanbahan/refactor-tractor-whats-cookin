class Recipe {
  constructor(recipe) {
    this.name = recipe.name;
    this.id = recipe.id;
    this.ingredients = recipe.ingredients;
    this.instructions = recipe.instructions;
    this.tags = recipe.tags;
    this.image = recipe.image;
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
