class DomUpdates {
  constructor() {
    this.allCards = document.querySelector('.all-cards')
  }

  displayRecipeCards(user, favorites) {

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
        <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
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
        </div>`)
      })
    };

  getRecipes();

  }
}

export default DomUpdates;
