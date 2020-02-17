import './css/base.scss';
import './css/styles.scss';
const $ = require('jquery');


// import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';

let favButton = document.querySelector('.view-favorites');
let homeButton = document.querySelector('.home');
let cardArea = document.querySelector('.all-cards');

homeButton.addEventListener('click', cardButtonConditionals);
// favButton.addEventListener('click', viewFavorites);
cardArea.addEventListener('click', cardButtonConditionals);

let currentUser = new User(1,'John',[]);
let user;
let favorites;


(function getUsers() {
  fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData")
  .then(response => response.json())
  .then(data => {
    let userId = (Math.floor(Math.random() * 49) + 1);
    userId = 1;
    console.log(userId)
    let newUser = data.wcUsersData.find(user => user.id === Number(userId));
    user = new User(newUser.id, newUser.name, newUser.pantry);
    loadFavorites(user.id);
    getRecipes()
    greetUser(user);

  })
  .catch(error => console.log(error.message))
})();

function getRecipes() {
  fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData")
  .then(response => response.json())
  .then(data => {
    let cookbook = new Cookbook(data.recipeData);
    populateCards(cookbook.recipes);
  })
  .catch(error => console.log(error.message))
};

function greetUser(user) {
  $('.user-name').text(user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0]);
}


function loadFavorites(id){
  favorites = JSON.parse(localStorage.getItem(id)) || [];
  console.log(favorites);
}


// function viewFavorites() {
//   if (cardArea.classList.contains('all')) {
//     cardArea.classList.remove('all')
//   }
//   if (!user.favoriteRecipes.length) {
//     favButton.innerHTML = 'You have no favorites!';
//     populateCards(cookbook.recipes);
//     return
//   } else {
//     favButton.innerHTML = 'Refresh Favorites'
//     cardArea.innerHTML = '';
//     user.favoriteRecipes.forEach(recipe => {
//       cardArea.insertAdjacentHTML('afterbegin', `<div id='${recipe.id}'
//       class='card'>
//       <header id='${recipe.id}' class='card-header'>
//       <label for='add-button' class='hidden'>Click to add recipe</label>
//       <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
//       <img id='${recipe.id}' class='add'
//       src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
//       recipes to cook'></button>
//       <label for='favorite-button' class='hidden'>Click to favorite recipe
//       </label>
//       <button id='${recipe.id}' aria-label='favorite-button' class='favorite favorite-active card-button'>
//       </button></header>
//       <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
//       <img id='${recipe.id}' tabindex='0' class='card-picture'
//       src='${recipe.image}' alt='Food from recipe'>
//       </div>`)
//     })
//   }
// }

// function favoriteCard(event) {
//   let specificRecipe = cookbook.recipes.find(recipe => {
//     if (recipe.id  === Number(event.target.id)) {
//       return recipe;
//     }
//   })
//   if (!event.target.classList.contains('favorite-active')) {
//     event.target.classList.add('favorite-active');
//     favButton.innerHTML = 'View Favorites';
//     user.addToFavorites(specificRecipe);
//   } else if (event.target.classList.contains('favorite-active')) {
//     event.target.classList.remove('favorite-active');
//     user.removeFromFavorites(specificRecipe)
//   }
// }

function cardButtonConditionals(event) {
  // if (event.target.classList.contains('favorite')) {
  //   favoriteCard(event);
  // } else
  if (event.target.classList.contains('card-picture')) {

    displayDirections(event);

  } else if (event.target.classList.contains('home')) {
    favButton.innerHTML = 'View Favorites';
    populateCards(cookbook.recipes);
  }
}


function displayDirections(event) {

  fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData")
  .then(response => response.json())
  .then(data => {
    let recipe = data.recipeData.find(item => item.id === parseInt(event.target.id));
    recipe = new Recipe(recipe, 'test');

    cardArea.classList.add('all');
    cardArea.innerHTML = `<h3>${recipe.name}</h3>
    <p class='all-recipe-info'>
    <strong>Instructions: </strong><ol><span class='instructions recipe-info'>
    </span></ol>
    </p>
    `;


    let allRecipeInfo = document.querySelector('.all-recipe-info');

    let recipeIds = [...recipe.ingredients].map(recipe => recipe.id);

    fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData")
    .then(response => response.json())
    .then(data => {

      let ingredients;
      ingredients = data.ingredientsData
      .filter(item => item.id == recipeIds
        .find(id => id === item.id))
        .map(item => item.name);

      allRecipeInfo.insertAdjacentHTML('afterbegin', `<p>${ingredients}</p>`)

    })
    .catch(error => console.log(error.message))

    // recipe.ingredients.forEach(ingredient => {
    //   fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/ingredients/ingredientsData")
    //   .then(response => response.json())
    //   .then(data => {
    //     let ingredients;
    //     ingredients = data.ingredientsData.find(item => item.id == ingredient.id).name;
    //     allRecipeInfo.insertAdjacentHTML('afterbegin', `<p>${ingredients}</p>`)
    //     // console.log(ingredients);
    //   })
    //   .catch(error => console.log(error.message))
    // })

    recipe.instructions.forEach(instruction => {
      allRecipeInfo.insertAdjacentHTML('beforebegin', `<li>
      ${instruction.instruction}</li>
      `)
    })
  })
  .catch(error => console.log(error.message))

  // let cost = recipeObject.calculateCost()
  // let costInDollars = (cost / 100).toFixed(2)
}

//
// function getFavorites() {
//     user.favoriteRecipes.forEach(recipe => {
//       document.querySelector(`.favorite${recipe.id}`).classList.add('favorite-active')
//     })
// }

function populateCards(recipes) {
  cardArea.innerHTML = '';
  if (cardArea.classList.contains('all')) {
    cardArea.classList.remove('all')
  }
  recipes.forEach(recipe => {
    let isFavorite = '';
    if(favorites.includes(`${recipe.id}`)){
      isFavorite = 'favorite-active';
    } else {
      isFavorite = 'favorite';
    }
    cardArea.insertAdjacentHTML('afterbegin', `<div id='${recipe.id}'
    class='card'>
        <header id='${recipe.id}' class='card-header'>
          <label for='add-button' class='hidden'>Click to add recipe</label>
          <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
            <img id='${recipe.id} favorite' class='add'
            src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
            recipes to cook'>
          </button>
          <label for='favorite-button' class='hidden'>Click to favorite recipe
          </label>
          <button id='${recipe.id}' aria-label='favorite-button' class='favorite ${isFavorite} favorite${recipe.id} card-button'></button>
        </header>
          <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
          <img id='${recipe.id}' tabindex='0' class='card-picture'
          src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
    </div>`)
  })


  $('.favorite').click(function(){
    $(this).toggleClass('favorite-active');
    console.log(favorites.includes(this.id))
    if(favorites.includes(this.id)){
      console.log(this.id)
      favorites.splice(favorites.indexOf(this.id),1);
    } else{
      favorites.push(this.id);
    }
    localStorage.setItem(user.id,JSON.stringify(favorites));
  })
  // getFavorites();
};
