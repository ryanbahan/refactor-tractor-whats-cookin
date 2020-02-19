class DatabaseController {
  constructor() {
  }

  async getRecipes() {
    let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData");
    let recipeData = await response.json();

    return recipeData;
  };


  async getIngredients() {
    let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData");
    let ingredientsData = await response.json();

    return ingredientsData;
  };
}

export default DatabaseController;
