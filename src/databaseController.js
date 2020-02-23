import Pantry from './pantry';

class DatabaseController {
  constructor() {
  }

  async getUser() {
    let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData");
    let users = await response.json();

    return users;
  };

  async updatePantry(user) {
    let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData");
    let users = await response.json();
    let updatedUser = await users.wcUsersData.find(person => person.id == user.id);

    user.pantry = new Pantry(updatedUser.pantry);
    user.pantry.getPantryInfo(await this.getIngredients());
    console.log(user);
  };

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

  async updateIngredients(ingredients) {
    let data = JSON.stringify(ingredients);
	   let response = await fetch(
		"https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData",
		{
			method:"POST",
			headers: {
				"Content-Type": 'application/json'
			},
			body: data,
		}
	)
	let retrievedData = await response.json();
	console.log(retrievedData);
  }
}

export default DatabaseController;
