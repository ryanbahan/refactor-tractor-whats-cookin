class DomUpdates {
  constructor() {
    this.body = document.querySelector('body');
    this.allCards = document.querySelector('.all-cards');
  }

  displayRecipeCards(user, favorites) {
    console.log(favorites);
    const getRecipes = async () => {
      let response = await fetch("https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/recipes/recipeData");
      let recipeData = await response.json();
      populateCards(recipeData.recipeData, this.allCards);
    };

    function populateCards(recipes, target) {
      target.innerHTML = '';
      if (target.classList.contains('all')) {
        target.classList.remove('all')
      }
      recipes.forEach(recipe => {
        let isFavorite = '';

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
          <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
          </button>
          <button id='${recipe.id}' aria-label='favorite-button' class='favorite ${isFavorite} favorite${recipe.id} card-button'>
          </button>
          </div>
          </div>
        </div>`)
      })
    };

  getRecipes();

  }
  displayRecipe(id) {
    this.body.insertAdjacentHTML('afterbegin', `<section class="recipe-modal">
      <img src="https://spoonacular.com/recipeImages/595736-556x370.jpg" alt="recipe photo" class="recipe-view-image">
      <div class="recipe-title-top">
        <div class="recipe-name-container">
          <h3>Loaded Chocolate Chip Pudding Cookie Cups</h3>
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
        <p>Flour</p>
        <p>Baking Soda</p>
        <p>Egg</p>
        <p>Granulated Sugar</p>
        <p>Instant Vanilla Pudding Mix</p>
        <p>Light Brown Sugar</p>
        <p>Salt</p>
        <p>Sea Salt</p>
        <p>Semisweet Chocolate Chips</p>
        <p>Unsalted Butter</p>
        <p>Vanilla Extract</p>
      </div>
      <hr>
      <div class="recipe-instructions-list">
        <h4>Instructions</h4>
        <p>In a large mixing bowl, whisk together the dry ingredients
          (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl
          of a stand mixer, cream butter for 30 seconds. Gradually add granulated
          sugar and brown sugar and cream until light and fluffy.</p>
        <p>
          Add egg and vanilla and mix until combined.
        </p>
        <p>
          Add dry ingredients and mix on low just until incorporated.
          Stir in chocolate chips.Scoop the dough into 1,5 tablespoon size balls
          and place on a plate or sheet. Cover with saran wrap and chill at least
          2 hours or overnight.When ready to bake, preheat oven to 350 degrees.
        </p>
        <p>
          Place the cookie dough balls into ungreased muffin pan. Sprinkle with sea salt.
        </p>
        <p>
          Bake for 9 to 10 minutes, or until you see the edges start to brown.
        </p>
        <p>
          Remove the pan from the oven and let sit for 10 minutes before removing onto
          a cooling rack.Top with ice cream and a drizzle of chocolate sauce.
        </p>
      </div>
      <a href="#" class="close-link"><b>Close</b></a>
    </section>
    <div class="modal-opacity">
    </div>`);

    document.querySelector('.close-link').addEventListener('click', this.closeModal)

  }
  closeModal() {
    this.closest('.recipe-modal').remove();
    document.querySelector('.modal-opacity').remove();
  }
}

export default DomUpdates;
