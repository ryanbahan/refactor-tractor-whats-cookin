class DatabaseController {
  constructor() {}

  async getUser() {
    let userId = 1;
    let response = await fetch(
      "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData"
    );
    let users = await response.json();
    let user = users.wcUsersData.find(person => person.id === Number(userId));

    return user;
  }
  async updateUserPantry(currentUser){
    let ingredientsData = await this.getIngredients();
    let response = await fetch(
      "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData"
    );
    let users = await response.json();
    let user = users.wcUsersData.find(person => person.id === Number(currentUser.id));
    currentUser.pantry.contents = user.pantry;
    currentUser.pantry.getPantryInfo(ingredientsData);
  }

  async getRecipes() {
    let response = await fetch(
      "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData"
    );
    let recipeData = await response.json();

    return recipeData;
  }

  async getIngredients() {
    let response = await fetch(
      "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData"
    );
    let ingredientsData = await response.json();

    return ingredientsData;
  }

  async updateIngredients(ingredients) {
    let data = JSON.stringify(ingredients);
    let response = await fetch(
      "https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      }
    );
    let retrievedData = await response.json();
    console.log(retrievedData);
  }

}

export default DatabaseController;
