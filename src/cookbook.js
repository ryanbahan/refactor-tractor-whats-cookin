class Cookbook {
  constructor(userID) {
    this.id = userID;
    let storedValue = JSON.parse(localStorage.getItem(this.id)) || {
      favorites: [],
      savedRecipes: []
    };
    this.favoriteRecipes = storedValue.favorites || [];
    this.savedRecipes = storedValue.savedRecipes || [];
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

  updateFavorites(recipeID) {
    if (this.favoriteRecipes.includes(recipeID)) {
      this.favoriteRecipes.splice(this.favoriteRecipes.indexOf(recipeID), 1);
    } else {
      this.favoriteRecipes.push(recipeID);
    }
    this.save();
  }

  updateSavedRecipes(recipeID) {
    if (this.savedRecipes.includes(recipeID)) {
      this.savedRecipes.splice(this.savedRecipes.indexOf(recipeID), 1);
    } else {
      this.savedRecipes.push(recipeID);
    }
    this.save();
  }

  cook(recipeID) {
    this.savedRecipes.splice(this.savedRecipes.indexOf(recipeID), 1);
    this.save();
  }

  isSaved(recipeID) {
    return this.savedRecipes.includes(recipeID);
  }
}

export default Cookbook;
