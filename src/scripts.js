import './css/base.scss';
import './css/styles.scss';
const $ = require('jquery');

import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import DomUpdates from './domUpdates';
import DatabaseController from './databaseController';

let domUpdates = new DomUpdates();
let databaseController = new DatabaseController();

let user;
let recipes = [];

(async function start() {

  let newUser = await databaseController.getUser();
  let recipeData = await databaseController.getRecipes();
  let ingredientsData = await databaseController.getIngredients();

  recipeData.recipeData.forEach(recipe => {
    let item = new Recipe(recipe);
    item.getIngredientsInfo(ingredientsData);
    recipes.push(item);
  })

  user = new User(newUser.id, newUser.name, newUser.pantry);
  user.pantry.getPantryInfo(ingredientsData);

  domUpdates.displayRecipeCards(user, user.cookbook.favoriteRecipes,user.cookbook.savedRecipes, recipes);
  domUpdates.greetUser(user);
  domUpdates.createDOMBindings(user,recipes);

})();


