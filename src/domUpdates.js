class DomUpdates {
  constructor() {
    this.body = document.querySelector('body');
    this.allCards = document.querySelector('.all-cards');
  }

  displayRecipeCards(user, favorites, recipeData) {

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

  populateCards(recipeData.recipeData, this.allCards);

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
}

export default DomUpdates;
