class DatabaseController {
  constructor() {
  }

  async getRecipes() {
    let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData");
    let recipeData = await response.json();

    return recipeData;
  };

  async getRecipeData(id) {

    let recipesResponse = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData");
    let recipeData = await recipesResponse.json();
    let recipe = recipeData.recipeData.find(recipe => recipe.id == id);

    let ingredientsResponse = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData");
    let ingredientsData = await ingredientsResponse.json();

    let recipeIngredients;

    recipe.ingredients.forEach(ingredient => {
      ingredient.name = ingredientsData.ingredientsData.find(item => item.id == ingredient.id).name;
    });

    return recipe;
  }

  async getIngredients() {
    let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData");
    let ingredientsData = await response.json();

    return ingredientsData;
  };
}

export default DatabaseController;
