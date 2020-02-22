import Cookbook from "./cookbook";
import Pantry from "./pantry";

class User {
  constructor(id, name, pantry) {
    this.id = id;
    this.name = name;
    this.pantry = new Pantry(pantry);
    this.cookbook = new Cookbook(this.id);
  }

  filterFavorites(tag) {
    return this.favoriteRecipes.filter(recipe => {
      return recipe.tags.includes(tag);
    });
  }

  findFavorites(strgToSrch) {
    return this.favoriteRecipes.filter(recipe => {
      return (
        recipe.name.includes(strgToSrch) ||
        recipe.ingredients.find(ingredient => {
          return ingredient.name.includes(strgToSrch);
        })
      );
    });
  }

  checkPantry(recipe) {
    let missingIngredients = recipe.ingredients.reduce(
      (missingItems, ingredient) => {
        let pantryIngredientQnt =
          this.pantry.find(x => x.ingredient === ingredient.id) || 0;
        if (pantryIngredientQnt != 0) {
          pantryIngredientQnt = pantryIngredientQnt.amount;
        }
        if (pantryIngredientQnt - ingredient.quantity.amount < 0) {
          missingItems.push({
            name: ingredient.name,
            quantity: {
              amount: ingredient.quantity.amount - pantryIngredientQnt,
              unit: ingredient.quantity.unit
            },
            cost:
              (ingredient.quantity.amount - pantryIngredientQnt) *
              recipe.findCost(ingredient.id)
          });
        }
        return missingItems;
      },
      []
    );
    return missingIngredients;
  }
}

export default User;
