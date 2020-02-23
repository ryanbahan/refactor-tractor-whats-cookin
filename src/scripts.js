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

  user = new User(newUser.id, newUser.name, newUser.pantry);

  recipeData.recipeData.forEach(recipe => {
    let item = new Recipe(recipe);
    item.getIngredientsInfo(ingredientsData);
    recipes.push(item);
  })

  user.pantry.contents = user.pantry.contents.map(ingredient => {

    let ingredientData = ingredientsData.ingredientsData.find(item => {
      return item.id === ingredient.ingredient
    })

    ingredientData.amount = ingredient.amount

    return ingredientData;
  })

  user.pantry.contents = user.pantry.contents.filter(item => item !== undefined);

  domUpdates.displayRecipeCards(user, user.cookbook.favoriteRecipes,user.cookbook.savedRecipes, recipes);
  greetUser(user);
  domUpdates.createDOMBindings(user,recipes);

})();

function greetUser(user) {
  $('.user-name').text(user.name.split(' ')[0] + '\xa0' + user.name.split(' ')[1][0]);
};
