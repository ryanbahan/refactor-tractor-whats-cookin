const $ = require('jquery');

class DomUpdates {
  constructor() {
    this.body = document.querySelector('body');
    this.allCards = document.querySelector('.all-cards');
    this.filter = document.querySelector('.filter');
    this.searchField = document.querySelector('.search-bar');
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
          <h3>$${recipe.calculateTotalRecipeCost()}</h3>
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
      console.log()
      ingredientsList.insertAdjacentHTML('beforeend', `<p>${ingredient.name.replace(/^\w/, c => c.toUpperCase())} ${ingredient.quantity.amount} ${ingredient.quantity.unit}</p>`)
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

  closeFilter() {
    this.closest('.filter-dropdown').remove();
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

    let ingredients = user.pantry.getNeededIngredients(user.cookbook.savedRecipes, user.pantry.contents, recipes);

    let htmlStart = `<section class="grocery-modal">
      <hr>`;

    let items = ingredients[0].map(ingredient => {
      let htmlMiddle = `<div class="grocery-item">
        <p>${ingredient.name.replace(/^\w/, c => c.toUpperCase())}</p>
        <div class="grocery-right-container">
          <p class="grocery-qty">QTY: ${ingredient.quantity.amount.toFixed(2)}</p>
          <p>Price: $${ingredient.cost}</p>
        </div>
      </div>`
      return htmlMiddle;
    });

    items = items.join('');

    let htmlBottom = `<hr>
    <div class="grocery-totals">
    <p>QTY: ${ingredients[2]}</p>
    <p>Total: $${ingredients[1]}</p>
    </div>
    <div class="grocery-bottom">
      <button type="submit" class="grocery-submit close-link">Checkout</button>
    </div>
  </section>
  <div class="modal-opacity">
  </div>`;

    this.body.insertAdjacentHTML('afterbegin', `${htmlStart}
      ${items}
      ${htmlBottom}`);

    document.querySelector('.close-link').addEventListener('click', this.closeGroceryModal)
  }

  filterDropdownView() {

    this.filter.insertAdjacentHTML('afterbegin', `<section class="filter-dropdown">
    <div class="fieldset-container">
      <fieldset class="filter-options">
        <input type="checkbox" id="Antipasti" name="Antipasti"
           checked>
           <label for="Antipasti">Antipasto</label>
       <input type="checkbox" id="Antipasto" name="Antipasto"
          checked>
          <label for="Antipasto">Antipasto</label>
      <input type="checkbox" id="Appetizer" name="Appetizer"
         checked>
         <label for="Appetizer">Appetizer</label>
     <input type="checkbox" id="Breakfast" name="Breakfast"
        checked>
        <label for="Breakfast">Breakfast</label>
     <input type="checkbox" id="Brunch" name="Brunch"
        checked>
        <label for="Brunch">Brunch</label>
     <input type="checkbox" id="Condiment" name="Condiment"
        checked>
        <label for="Condiment">Condiment</label>
     <input type="checkbox" id="Dinner" name="Dinner"
        checked>
        <label for="Dinner">Dinner</label>
     <input type="checkbox" id="Dip" name="Dip"
        checked>
        <label for="Dip">Dip</label>
     <input type="checkbox" id="hor d\'oeuvre" name="hor d\'oeuvre"
        checked>
        <label for="hor d\'oeuvre">hor d\'oeuvre</label>
      </fieldset>
      <fieldset>
      <input type="checkbox" id="Lunch" name="Lunch"
         checked>
         <label for="Lunch">Lunch</label>
      <input type="checkbox" id="Main Course" name="Main Course"
         checked>
         <label for="Main Course">Main Course</label>
      <input type="checkbox" id="Main Dish" name="Main Dish"
         checked>
         <label for="Main Dish">Main Dish</label>
      <input type="checkbox" id="Morning Meal" name="Morning Meal"
         checked>
         <label for="Morning Meal">Morning Meal</label>
      <input type="checkbox" id="Salad" name="Salad"
         checked>
         <label for="Salad">Salad</label>
      <input type="checkbox" id="Sauce" name="Sauce"
         checked>
         <label for="Sauce">Sauce</label>
      <input type="checkbox" id="Side Dish" name="Side Dish"
         checked>
         <label for="Side Dish">Side Dish</label>
      <input type="checkbox" id="Snack" name="Snack"
         checked>
         <label for="Snack">Snack</label>
      <input type="checkbox" id="Spread" name="Spread"
         checked>
         <label for="Spread">Spread</label>
      <input type="checkbox" id="Starter" name="Starter"
         checked>
         <label for="Starter">Starter</label>
      </fieldset>
      </div>
      <div class="grocery-bottom">
        <button type="submit" class="filter-close close-link">Close</button>
      </div>
    </section>
    `);

    document.querySelector('.close-link').addEventListener('click', this.closeFilter)

  }

  searchCards(user, recipes) {
  var query = new RegExp(`${this.searchField.value}`, 'gi');

  var matches = recipes.filter(recipe => recipe.name.match(query));

  this.displayRecipeCards(user, user.cookbook.favoriteRecipes,user.cookbook.savedRecipes, matches);
};

  createDOMBindings(user,recipes){
    $('.search-bar').on('input',() => {
      this.searchCards(user, recipes);
    });

    $('#saved-recipes-filter').on('click',() => {
      this.savedRecipesFilter(user,recipes);
    });
    $('#favorites-filter').on('click', () => {
      this.favoritesFilter(user,recipes);
    });

    $('#grocery-list').on('click',() => {
      this.groceryListView(user,recipes);
    });

    $('.filter-button').on('click',() => {
      this.filterDropdownView(user,recipes);
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
