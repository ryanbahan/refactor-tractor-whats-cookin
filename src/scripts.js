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

cardArea.addEventListener('click', cardButtonConditionals);

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
  console.log(recipes);
  console.log(recipeData.recipeData);

  domUpdates.displayRecipeCards(user, user.cookbook.favoriteRecipes, recipes);
  greetUser(user);

})();

function greetUser(user) {
  $('.user-name').text(user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0]);
};

// $('#grocery-list-filter').on('click',groceryFilter);

$('#saved-recipes-filter').on('click',savedRecipesFilter);

function savedRecipesFilter() {
  console.log(this);
  let savedFavoritesDOM = recipes.filter((recipe) => {
    return user.cookbook.savedRecipes.includes(recipe.id);
  })
  domUpdates.displayRecipeCards(user, user.cookbook.favoriteRecipes, recipeData)
}

$('#favorites-filter').on('click',favoritesFilter)
function favoritesFilter() {
  console.log(this);
}

async function cardButtonConditionals(event) {
  if (event.target.classList.contains('favorite')) {
    toggleClick()
  } else if (!event.target.classList.contains('favorite')) {
    let id = event.target.closest('.card').id;
    let recipe = await databaseController.getRecipeData(id);
    domUpdates.displayRecipe(id, recipe);
  }
};

const toggleClick = () => {
  $(event.target).toggleClass('favorite-active');
  user.cookbook.updateFavorites(event.target.id);
};
