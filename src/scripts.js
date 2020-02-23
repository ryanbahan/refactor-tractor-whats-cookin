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
  user = new User(newUser.id, newUser.name, newUser.pantry);

  let recipeData = await databaseController.getRecipes();
  recipeData.recipeData.forEach(recipe => {
    recipes.push(new Recipe(recipe));
  })

  let ingredientsData = await databaseController.getIngredients();

  recipes.forEach(recipe => {
    recipe.ingredients = recipe.ingredients.map( ingredient => {
      let ingredientData = ingredientsData.ingredientsData.find(item => {
        return item.id === ingredient.id
      })
      ingredient.name = ingredientData.name;
      ingredient.estimatedCostInCents = ingredientData.estimatedCostInCents
      return ingredient
    })
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
