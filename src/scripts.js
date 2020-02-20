import './css/base.scss';
import './css/styles.scss';
const $ = require('jquery');


// import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import DomUpdates from './domUpdates';
import DatabaseController from './databaseController';

let cardArea = document.querySelector('.all-cards');
let domUpdates = new DomUpdates();
let databaseController = new DatabaseController();

// cardArea.addEventListener('click', cardButtonConditionals);

let userId = (Math.floor(Math.random() * 49) + 1);
let user;
let recipes = [];

(async function start() {
  let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData");
  let newUser = await response.json();

  newUser = newUser.wcUsersData.find(user => user.id === Number(userId));
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
  domUpdates.displayRecipeCards(user, user.cookbook.favoriteRecipes, recipes);
  greetUser(user);
  domUpdates.createDOMBindings(user,recipes);

})();

function greetUser(user) {
  $('.user-name').text(user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0]);
};

// async function cardButtonConditionals(event) {
//   if (event.target.classList.contains('favorite')) {
//     toggleClick()
//   } else if (!event.target.classList.contains('favorite')) {
//     let id = event.target.closest('.card').id;
//     let recipe = recipes.find(item => {
//       return item.id == id
//     });
//     domUpdates.displayRecipe(id, recipe);
//   }
// };

// const toggleClick = () => {
//   $(event.target).toggleClass('favorite-active');
//   user.cookbook.updateFavorites(event.target.id);
// };
