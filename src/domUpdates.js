const $ = require('jquery');

class DomUpdates {
  constructor() {
    this.body = document.querySelector('body');
    this.allCards = document.querySelector('.all-cards');
  }

  displayRecipeCards(user, favorites,savedRecipes, recipeData) {

    function populateCards(recipes, target) {
      target.innerHTML = '';
      if (target.classList.contains('all')) {
        target.classList.remove('all')
      }
      recipes.forEach(recipe => {
        let isFavorite = '';
        let isSaved ='';
        if(savedRecipes.includes(`${recipe.id}`)){
          isSaved = 'add-button-active';
        } 
        if(favorites.includes(`${recipe.id}`)){
          isFavorite = 'favorite-active';
        } else {
          isFavorite = 'favorite';
        }

        target.insertAdjacentHTML('afterbegin', `<div id='${recipe.id}'
        class='card'>

              <img id='${recipe.id}' tabindex='0' class='card-picture'
              src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
              <div class="card-title-info">
        <p id='${recipe.id}' class='recipe-name'>${recipe.name}</p>

          <div class="card-button-container">
          <button id='${recipe.id}' aria-label='add-button' class='add-button ${isSaved} card-button'>
          </button>
          <button id='${recipe.id}' aria-label='favorite-button' class='favorite ${isFavorite} favorite${recipe.id} card-button'>
          </button>
          </div>
          </div>
        </div>`)
      })
    };

  populateCards(recipeData, this.allCards);

  }

  async displayRecipe(id, recipe) {

    this.body.insertAdjacentHTML('afterbegin', `<section class="recipe-modal">
      <img src="${recipe.image}" alt="recipe photo" class="recipe-view-image">
      <div class="recipe-title-top">
        <div class="recipe-name-container">
          <h3>${recipe.name}</h3>
          <h3>$XX</h3>
        </div>
        <div class="card-button-container">
          <button aria-label='add-button' class='add-button card-button'>
          </button>
          <button aria-label='favorite-button' class='favorite card-button'>
          </button>
        </div>
      </div>
      <hr>
      <div class="ingredients-list">
        <h4>Ingredients:</h4>
      </div>
      <hr>
      <div class="recipe-instructions-list">
        <h4>Instructions</h4>
      </div>
      <a href="#" class="close-link"><b>Close</b></a>
    </section>
    <div class="modal-opacity">
    </div>`);

    let ingredientsList = document.querySelector('.ingredients-list');
    let instructionsList = document.querySelector('.recipe-instructions-list');

    recipe.ingredients.forEach(ingredient => {
      ingredientsList.insertAdjacentHTML('beforeend', `<p>${ingredient.name.replace(/^\w/, c => c.toUpperCase())}</p>`)
    })

    recipe.instructions.forEach(instruction => {
      instructionsList.insertAdjacentHTML('beforeend', `<p>${instruction.number}. ${instruction.instruction}</p>`)
    });

    document.querySelector('.close-link').addEventListener('click', this.closeModal)

  }

  closeModal() {
    this.closest('.recipe-modal').remove();
    document.querySelector('.modal-opacity').remove();
  }

  closeGroceryModal() {
    console.log('modal');
    this.closest('.grocery-modal').remove();
    document.querySelector('.modal-opacity').remove();
  }

  home(user,recipes){
    this.displayRecipeCards(user, user.cookbook.favoriteRecipes,user.cookbook.savedRecipes, recipes);
  }

  savedRecipesFilter(user,recipes) {
    let savedFavoritesDOM = recipes.filter((recipe) => {
      return user.cookbook.savedRecipes.includes(`${recipe.id}`);
    })
    this.displayRecipeCards(user, user.cookbook.favoriteRecipes,user.cookbook.savedRecipes, savedFavoritesDOM);
  }

  favoritesFilter(user,recipes) {
    let savedFavoritesDOM = recipes.filter((recipe) => {
      return user.cookbook.favoriteRecipes.includes(`${recipe.id}`);
    })
    this.displayRecipeCards(user, user.cookbook.favoriteRecipes,user.cookbook.savedRecipes,savedFavoritesDOM);
  }

  cardHelper(user,recipes) {
    let target = $(event.target);
    let id = target.attr('id')
    if(target.hasClass('favorite')) {
      this.toggleFav(user,target)
    } else if(target.hasClass('add-button')) {
      this.toggleSavedRecipe(user,target)
    } else {
      let recipe = recipes.find(item => {
        return item.id == id
      });
      this.displayRecipe(id,recipe);
    }
  }

  toggleFav(user,target) {
    target.toggleClass('favorite-active');
    let id = target.attr('id')
    user.cookbook.updateFavorites(id);
  }

  toggleSavedRecipe(user,target) {
    target.toggleClass('add-button-active');
    let id = target.attr('id')
    user.cookbook.updateSavedRecipes(id);
  }

  groceryListView(user,recipes) {

    this.body.insertAdjacentHTML('afterbegin', `<section class="grocery-modal">
      <hr>
        <div class="grocery-item">
          <p>Item name</p>
          <div class="grocery-right-container">
            <p class="grocery-qty">QTY: 2</p>
            <p>Price: $1.50</p>
          </div>
        </div>
        <div class="grocery-item">
          <p>Item name</p>
          <div class="grocery-right-container">
            <p class="grocery-qty">QTY: 2</p>
            <p>Price: $1.50</p>
          </div>
        </div>
        <div class="grocery-item">
          <p>Item name</p>
          <div class="grocery-right-container">
            <p class="grocery-qty">QTY: 2</p>
            <p>Price: $1.50</p>
          </div>
        </div>
      <hr>
      <div class="grocery-totals">
      <p>QTY: 15</p>
      <p>Total: $12.25</p>
      </div>
      <div class="grocery-bottom">
        <button type="submit" class="grocery-submit close-link">Checkout</button>
      </div>
    </section>
    <div class="modal-opacity">
    </div>`);

    document.querySelector('.close-link').addEventListener('click', this.closeGroceryModal)

    console.log('grocery list');
  }

  createDOMBindings(user,recipes){

    $('#saved-recipes-filter').on('click',() => {
      this.savedRecipesFilter(user,recipes);
    });
    $('#favorites-filter').on('click', () => {
      this.favoritesFilter(user,recipes);
    });

    $('#grocery-list').on('click',() => {
      this.groceryListView(user,recipes);
    });

    $('#home').on('click',() => {
      this.home(user,recipes);
    });
    $('.all-cards').on('click', () =>{
      this.cardHelper(user,recipes);
    })
  }
}

export default DomUpdates;
