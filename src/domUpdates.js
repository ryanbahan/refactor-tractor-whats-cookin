const $ = require('jquery');
import DatabaseController from './databaseController';
import Pantry from './pantry';

class DomUpdates {
  constructor() {
    this.body = $("body");
    this.allCards = $(".all-cards");
    this.filter = $(".filter");
    this.searchField = $(".search-bar");
    this.activeFilterCategories = [];
  }

  greetUser(user) {
    $(".user-name").text(
      user.name.split(" ")[0] + "\xa0" + user.name.split(" ")[1][0]
    );
  }

  async displayRecipeCards(user, favorites, savedRecipes, recipeData) {
    let controller = new DatabaseController();
    await controller.updateUserPantry(user);

    function populateCards(recipes, target) {
      $(target).html("");
      if (target.hasClass("all")) {
        target.removeClass("all");
      }
      recipes.forEach(recipe => {
        let isFavorite = "";
        let isSaved = "";
        let canCookHTML = "";
        // console.log(user.cookbook.isSaved(`${recipe.id}`))
        if (
          user.pantry.checkIfCookable(recipes, recipe.id) &&
          user.cookbook.isSaved(`${recipe.id}`)
        ) {
          canCookHTML = `<button id='${recipe.id}' aria-label='cook-button' class='cook card-button'>
          </button>`;
        }
        if (savedRecipes.includes(`${recipe.id}`)) {
          isSaved = "add-button-active";
        }
        if (favorites.includes(`${recipe.id}`)) {
          isFavorite = "favorite-active";
        } else {
          isFavorite = "favorite";
        }

        $(".all-cards").append(`
        <div id='${recipe.id}' class='card'>
          <img id='${recipe.id}' tabindex='0' class='card-picture' src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
          <div class="card-title-info">
          <p id='${recipe.id}' class='recipe-name'>${recipe.name}</p>
          <div class="card-button-container">
          ${canCookHTML}
          <button id='${recipe.id}' aria-label='add-button' class='add-button ${isSaved} card-button'>
          </button>
          <button id='${recipe.id}' aria-label='favorite-button' class='favorite ${isFavorite} favorite${recipe.id} card-button'>
          </button>
          </div>
          </div>
        </div>
        </div>`);
      });
    }

    populateCards(recipeData, this.allCards);
  }

  async displayRecipe(id, recipe, user, recipes) {
    let isFavorite = "";
    let isSaved = "";
    let canCookHTML = "";

    if (
      user.pantry.checkIfCookable(recipes, recipe.id) &&
      user.cookbook.isSaved(`${recipe.id}`)
    ) {
      canCookHTML = `<button id='${recipe.id}' aria-label='cook-button' class='cook card-button'>
      </button>`;
    }

    if (user.cookbook.savedRecipes.includes(`${recipe.id}`)) {
      isSaved = "add-button-active";
    }

    if (user.cookbook.favoriteRecipes.includes(`${recipe.id}`)) {
      isFavorite = "favorite-active";
    } else {
      isFavorite = "favorite";
    }

    $("body").append(`<section class="recipe-modal">
      <img src="${recipe.image}" alt="recipe photo" class="recipe-view-image">
      <div class="recipe-title-top">
        <div class="recipe-name-container">
          <h3>${recipe.name}</h3>
          <h3>$${recipe.calculateTotalRecipeCost()}</h3>
        </div>
        <div class="card-button-container">
        ${canCookHTML}
        <button id='${
          recipe.id
        }' aria-label='add-button' class='add-button ${isSaved} card-button'>
        </button>
        <button id='${
          recipe.id
        }' aria-label='favorite-button' class='favorite ${isFavorite} favorite${
      recipe.id
    } card-button'>
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
      <a href="#" class="close-link">Close</a>
    </section>
    <div class="modal-opacity">
    </div>`);

    let missingIngredients = user.pantry.returnNeededIngredients(recipes, id);

    recipe.ingredients.forEach(ingredient => {

      if (missingIngredients.find(item => item.id == ingredient.id)) {
        $(
          `<p>${ingredient.name.replace(/^\w/, c => c.toUpperCase())} ${
            ingredient.quantity.amount
          } ${ingredient.quantity.unit}
          <span class="down-arrow">\u00D7</span></p>`
        ).insertAfter(".ingredients-list");
      } else {
        $(
          `<p>${ingredient.name.replace(/^\w/, c => c.toUpperCase())} ${
            ingredient.quantity.amount
          } ${ingredient.quantity.unit}</p>`
        ).insertAfter(".ingredients-list");
      }

    });

    recipe.instructions.reverse();
    $(".cook-button").on("click", () => {
      this.cardHelper(user, recipes);
    });

    recipe.instructions.forEach(instruction => {
      $(`<p>${instruction.number}. ${instruction.instruction}</p>`).insertAfter(
        ".recipe-instructions-list"
      );
    });
  }

  closeModal(user, recipes) {
    if ($(event.target).hasClass("close-link")) {
      $(".recipe-modal").remove();
      $(".modal-opacity").remove();

      this.displayRecipeCards(
        user,
        user.cookbook.favoriteRecipes,
        user.cookbook.savedRecipes,
        recipes
      );
    }
  }

  closeGroceryModalWithoutCheckout(user, recipes) {
    if ($(event.target).hasClass("close-link")) {
      $(".grocery-modal").remove();
      $(".modal-opacity").remove();
    }
  }

  closeGroceryModal(user, recipes) {
    if ($(event.target).hasClass("grocery-submit")) {
      let ingredients = user.pantry.getNeededIngredients(
        user.cookbook.savedRecipes,
        recipes
      );
      let controller = new DatabaseController();

      console.log("on modal", ingredients[0]);

      ingredients[0].forEach(ingredient => {
        let jsonInfo = {
          userID: user.id,
          ingredientID: ingredient.id,
          ingredientModification: ingredient.quantity.amount
        };
        controller.updateIngredients(jsonInfo);
      });

      controller.updateUserPantry(user);

      this.displayRecipeCards(
        user,
        user.cookbook.favoriteRecipes,
        user.cookbook.savedRecipes,
        recipes
      );

      $(".grocery-modal").remove();
      $(".modal-opacity").remove();
    }
  }

  viewHomePage(user, recipes) {
    this.displayRecipeCards(
      user,
      user.cookbook.favoriteRecipes,
      user.cookbook.savedRecipes,
      recipes
    );
  }

  viewSavedRecipes(user, recipes) {
    let savedFavoritesDOM = recipes.filter(recipe => {
      return user.cookbook.savedRecipes.includes(`${recipe.id}`);
    });

    this.displayRecipeCards(
      user,
      user.cookbook.favoriteRecipes,
      user.cookbook.savedRecipes,
      savedFavoritesDOM
    );
  }

  viewFavoriteRecipes(user, recipes) {
    let savedFavoritesDOM = recipes.filter(recipe => {
      return user.cookbook.favoriteRecipes.includes(`${recipe.id}`);
    });

    this.displayRecipeCards(
      user,
      user.cookbook.favoriteRecipes,
      user.cookbook.savedRecipes,
      savedFavoritesDOM
    );
  }

  cardHelper(user, recipes) {
    let target = $(event.target);
    let id = target.attr("id");
    if (target.hasClass("favorite")) {
      this.toggleFavoriteRecipe(user, target);
    } else if (target.hasClass("add-button")) {
      this.toggleSavedRecipe(user, target, recipes);
    } else if (target.hasClass("cook")) {
      this.cook(user, target, recipes);
    } else if ($(event.target).parents(".card").length) {
      let recipe = recipes.find(item => {
        return item.id == id;
      });
      this.displayRecipe(id, recipe, user, recipes);
    }
  }

  toggleFavoriteRecipe(user, target) {
    target.toggleClass("favorite-active");
    let id = target.attr("id");
    user.cookbook.updateFavorites(id);
  }

  toggleSavedRecipe(user, target, recipes) {
    target.toggleClass("add-button-active");
    let id = target.attr("id");
    user.cookbook.updateSavedRecipes(id);
    if (user.pantry.checkIfCookable(recipes, id) && user.cookbook.isSaved(id)) {
      $(target)
        .before(`<button id='${id}' aria-label='cook-button' class='cook card-button'>
      </button>`);
    } else if (user.pantry.checkIfCookable(recipes, id)) {
      $(target)
        .prev()
        .remove();
    }
  }

  async viewGroceryList(user, recipes) {
    let controller = new DatabaseController();

    controller.updateUserPantry(user);

    let ingredients = user.pantry.getNeededIngredients(
      user.cookbook.savedRecipes,
      recipes
    );
    console.log("on modal open - pantry", user.pantry);
    console.log("on modal open - needed ingredients", ingredients);

    let htmlStart = `<section class="grocery-modal">
      <div class="grocery-top">
        <p>Your Cart</p>
        <button class="close-link">Close</button>
      </div>
      <hr>`;

    let items = ingredients[0].map(ingredient => {
      let htmlMiddle = `<div class="grocery-item">
        <p>${ingredient.name.replace(/^\w/, c => c.toUpperCase())}</p>
        <div class="grocery-right-container">
          <p class="grocery-qty">QTY: ${ingredient.quantity.amount.toFixed(
            2
          )}</p>
          <p>Price: $${ingredient.cost}</p>
        </div>
      </div>`;
      return htmlMiddle;
    });

    items = items.join("");

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

    $("body").append(`${htmlStart}${items}${htmlBottom}`);
  }

  closeFilter(user, recipes) {
    if ($(event.target).hasClass("filter-close")) {
      this.updateCheckedItems();

      let filteredItems = this.getFilteredRecipes(
        this.activeFilterCategories,
        recipes
      );

      this.displayRecipeCards(
        user,
        user.cookbook.favoriteRecipes,
        user.cookbook.savedRecipes,
        filteredItems
      );

      console.log(filteredItems);

      $(".filter-dropdown").remove();
    }
  }

  getFilteredRecipes(activeCategories, recipes) {
    let matches = [];

    activeCategories.forEach(category => {
      let query = new RegExp(`${category}`, "gi");

      let queryMatches = recipes.filter(recipe =>
        recipe.tags.find(item => item.match(query))
      );

      matches.push(queryMatches);
    });

    matches = matches.flat();

    matches = matches.reduce((list, recipe) => {
      if (!list.find(item => item.id === recipe.id)) {
        list.push(recipe);
      }
      return list;
    }, []);

    return matches;
  }

  updateCheckedItems() {
    $(".filter-checkbox:checked").each((index, value) => {
      if (!this.activeFilterCategories.find(item => item === value.id)) {
        this.activeFilterCategories.push(value.id);
      }
    });

    $(".filter-checkbox:not(:checked)").each((index, value) => {
      if (this.activeFilterCategories.find(item => item === value.id)) {
        let index = this.activeFilterCategories.findIndex(
          item => item === value.id
        );
        this.activeFilterCategories.splice(index, 1);
      }
    });
  }

  populateCheckedFilterItems() {
    $(".filter-checkbox").each((index, value) => {
      if (this.activeFilterCategories.find(item => item === value.id)) {
        $(`#${value.id}`).prop("checked", true);
      } else {
        $(`#${value.id}`).prop("checked", false);
      }
    });
  }

  filterDropdownView() {
    $(".filter").append(`<section class="filter-dropdown">
    <div class="fieldset-container">
      <fieldset class="filter-options">
        <input class="filter-checkbox" type="checkbox" id="antipasti" name="Antipasti"
        >
           <label for="Antipasti">Antipasti</label>
       <input class="filter-checkbox" type="checkbox" id="antipasto" name="Antipasto"
      >
          <label for="Antipasto">Antipasto</label>
      <input class="filter-checkbox" type="checkbox" id="appetizer" name="Appetizer"
      >
         <label for="Appetizer">Appetizer</label>
     <input class="filter-checkbox" type="checkbox" id="breakfast" name="Breakfast"
    >
        <label for="Breakfast">Breakfast</label>
     <input class="filter-checkbox" type="checkbox" id="brunch" name="Brunch"
    >
        <label for="Brunch">Brunch</label>
     <input class="filter-checkbox" type="checkbox" id="condiment" name="Condiment"
    >
        <label for="Condiment">Condiment</label>
     <input class="filter-checkbox" type="checkbox" id="dinner" name="Dinner"
    >
        <label for="Dinner">Dinner</label>
     <input class="filter-checkbox" type="checkbox" id="dip" name="Dip"
    >
        <label for="Dip">Dip</label>
     <input class="filter-checkbox" type="checkbox" id="hor" name="hor doeuvre"
    >
        <label for="hor doeuvre">hor doeuvre</label>
      </fieldset>
      <fieldset>
      <input class="filter-checkbox" type="checkbox" id="lunch" name="Lunch"
      >
         <label for="Lunch">Lunch</label>
      <input class="filter-checkbox" type="checkbox" id="course" name="Main Course"
      >
         <label for="Main Course">Main Course</label>
      <input class="filter-checkbox" type="checkbox" id="dish" name="Main Dish"
      >
         <label for="Main Dish">Main Dish</label>
      <input class="filter-checkbox" type="checkbox" id="morning" name="Morning Meal"
      >
         <label for="Morning Meal">Morning Meal</label>
      <input class="filter-checkbox" type="checkbox" id="salad" name="salad"
      >
         <label for="Salad">Salad</label>
      <input class="filter-checkbox" type="checkbox" id="sauce" name="Sauce"
      >
         <label for="Sauce">Sauce</label>
      <input class="filter-checkbox" type="checkbox" id="side" name="Side Dish"
      >
         <label for="Side Dish">Side Dish</label>
      <input class="filter-checkbox" type="checkbox" id="snack" name="Snack"
      >
         <label for="Snack">Snack</label>
      <input class="filter-checkbox" type="checkbox" id="spread" name="Spread"
      >
         <label for="Spread">Spread</label>
      <input class="filter-checkbox" type="checkbox" id="starter" name="Starter"
      >
         <label for="Starter">Starter</label>
      </fieldset>
      </div>
      <div class="grocery-bottom">
        <button type="submit" class="filter-close close-link">Close</button>
      </div>
    </section>`);

    this.populateCheckedFilterItems();
  }

  searchCards(user, recipes) {
    let query = new RegExp(`${$(".search-bar").val()}`, "gi");
    let matches = recipes.filter(recipe => {
      return (
        recipe.name.match(query) ||
        recipe.ingredients.find(item => item.name.match(query))
      );
    });

    this.displayRecipeCards(
      user,
      user.cookbook.favoriteRecipes,
      user.cookbook.savedRecipes,
      matches
    );
  }

  async cook(user, target, recipes) {
    let controller = new DatabaseController();
    await controller.updateUserPantry(user);

    let recipeIngredients = recipes.find(
      item => item.id == $(target).attr("id")
    ).ingredients;
    user.cookbook.cook($(target).attr("id"));
    recipeIngredients.forEach(ingredient => {
      let jsonInfo = {
        userID: user.id,
        ingredientID: ingredient.id,
        ingredientModification: -ingredient.quantity.amount
      };
      controller.updateIngredients(jsonInfo);
    });
    await controller.updateUserPantry(user);
    if (!user.pantry.checkIfCookable(recipes, $(target).attr("id"))) {
      $(target)
        .next()
        .removeClass("add-button-active");
      $(target).remove();
    }

    await controller.updateUserPantry(user);

    this.displayRecipeCards(
      user,
      user.cookbook.favoriteRecipes,
      user.cookbook.savedRecipes,
      recipes
    );
  }

  createDOMBindings(user, recipes) {
    $(".search-bar").on("input", () => {
      this.searchCards(user, recipes);
    });

    $(".cook-button").on("click", () => {
      this.cardHelper(user, recipes);
    });

    $("#saved-recipes-filter").on("click", () => {
      this.savedRecipesFilter(user, recipes);
    });

    $("#saved-recipes").on("click", () => {
      this.viewSavedRecipes(user, recipes);
    });
    $("#favorites").on("click", () => {
      this.viewFavoriteRecipes(user, recipes);
    });

    $("#grocery-list").on("click", () => {
      this.viewGroceryList(user, recipes);
    });

    $(".filter-button").on("click", () => {
      this.filterDropdownView(user, recipes);
    });

    $("#home").on("click", () => {
      this.viewHomePage(user, recipes);
    });

    $("body").on("click", () => {
      this.cardHelper(user, recipes);
      this.closeModal(user, recipes);
      this.closeFilter(user, recipes);
      this.closeGroceryModal(user, recipes);
      this.closeGroceryModalWithoutCheckout(user, recipes);
    });
  }
}

export default DomUpdates;
