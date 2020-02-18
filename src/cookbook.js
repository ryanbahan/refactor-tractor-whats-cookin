class Cookbook {
  constructor(userID) {
    this.id = userID;
    let storedValue = JSON.parse(localStorage.getItem(2)) || {
      favorites: [],
      savedRecipes: []
    };
    this.favoriteRecipes = storedValue.favorites;
    this.savedRecipes = storedValue.savedRecipes;
  }
  
  save() {
    localStorage.setItem(
      this.id,
      JSON.stringify({
        favorites: this.favoriteRecipes,
        savedRecipes: this.savedRecipes
      })
    );
  }

  findRecipe(searchText) {
    return this.recipes.filter(recipe => {
      return recipe.ingredients.find(ingredient => {
        return (
          ingredient.name.includes(searchText) ||
          recipe.name.includes(searchText)
        );
      });
    });
  }
  

}

export default Cookbook;
