class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  prepareIngredients(recipeID, recipes,userID) {
    let preparingRecipe = recipes.find(recipe => {
      return recipe.id == recipeID;
    });
    let ingredientsNeeded = preparingRecipe.ingredients;
    //Remove Duplicates
    ingredientsNeeded = ingredientsNeeded.reduce((list, ingredient, index) => {
      let firstIndex = ingredientsNeeded.findIndex(item => {
        return item.id === ingredient.id;
      });
      if (firstIndex < index) {
        ingredientsNeeded[firstIndex].quantity.amount +=
          ingredient.quantity.amount;
      } else {
        list.push(ingredient);
      }
      return list;
    }, []);

    let hasIngredients = ingredientsNeeded.reduce(
      (hasIngredient, ingredient) => {
        let pantryIngredient = this.contents.find(
          item => item.id == ingredient.ingredient
        );
        if (pantryIngredient) {
          hasIngredient.ready =
            pantryIngredient.amount > ingredient.quantity.amount &&
            hasIngredient.ready;
        } else {
          hasIngredient.ready = false;
        }
        hasIngredient.req.push({
          userID:userID,
          ingredientID: ingredient.id,
          ingredientModification: ingredient.quantity.amount
        });
        return hasIngredient;
      },
      { ready: true, req: [] }
    );

    if (hasIngredients.ready) {
      return hasIngredients.req;
    } else {
      return hasIngredients.ready;
    }
  }

  getPantryInfo(ingredientsData) {
    this.contents = this.contents.map(ingredient => {
      let ingredientData = ingredientsData.ingredientsData.find(item => {
        return item.id === ingredient.ingredient;
      });
      ingredientData.amount = ingredient.amount;
 
      return ingredientData;
    });

    this.contents = this.contents.filter(item => item !== undefined);
  }

  getNeededIngredients(savedRecipes, recipes) {

    // remove any items that may cause issues
    let savedItems = savedRecipes.filter(recipe => recipe !== null);

    // get recipe ingredients from ID's
    let totalIngredientsNeeded = this.getSavedRecipeIngredients(savedItems, recipes);

    // remove duplicates
    totalIngredientsNeeded = this.mergeDuplicates(totalIngredientsNeeded);

    // get missing ingredients
    let missingIngredients = this.findMissingIngredients(totalIngredientsNeeded);

    // add cost to ingredients
    missingIngredients = this.addCostToIngredients(missingIngredients);

    // get total cost of items
    let totalCost = this.getTotalCost(missingIngredients);

    // get total quantity of items
    let quantities = this.getTotalQuantities(missingIngredients);

    return [missingIngredients, totalCost, quantities];
  }

  getSavedRecipeIngredients(savedRecipes, recipes) {
    let savedCopy = [...savedRecipes]
    return savedCopy.map(recipe => recipes.find(item => item.id == recipe))
                                .map(item => item = item.ingredients)
                                .filter(item => item !== null)
                                .flat();
  }

  mergeDuplicates(ingredients) {
    let newList = ingredients.reduce((list, item) => {

      if (list.find(recipe => recipe.id === item.id)) {

        let listItemIndex = list.findIndex(recipe => recipe.id === item.id);

        let updatedItem = {
          estimatedCostInCents: item.estimatedCostInCents,
          id: item.id,
          name: item.name,
          quantity: {amount: list[listItemIndex].quantity.amount + item.quantity.amount,
            unit: item.quantity.unit}
        };

        list.splice(listItemIndex, 1, updatedItem);

      } else {
        list.push(item);
      }

      return list;
    }, []);

    return [...newList];
  }

  findMissingIngredients(ingredients) {
    let missingIngredients = ingredients.reduce((list, ingredient) => {
      let pantryItem = this.contents.find(pantryItem => ingredient.id === pantryItem.id);

      if (pantryItem && pantryItem.amount < ingredient.quantity.amount) {

        let neededItem = {
          estimatedCostInCents: ingredient.estimatedCostInCents,
          id: ingredient.id,
          name: ingredient.name,
          quantity: {amount: ingredient.quantity.amount - pantryItem.amount,
             unit: ingredient.quantity.unit}
        };

      } else if (!pantryItem) {
        list.push(ingredient);
      }

      return list;
    }, []);

    return missingIngredients;
  }

  addCostToIngredients(ingredients) {
    return ingredients.map(item => {
      item.cost = (item.quantity.amount * item.estimatedCostInCents / 100).toFixed(2);
      return item;
    })
  }

  getTotalCost(ingredients) {
    let cost = ingredients.reduce((num, item) => {
      num += parseFloat(item.cost);
      return num;
    }, 0);

    return cost.toFixed(2);
  }

  getTotalQuantities(ingredients) {
    let quantities = ingredients.reduce((num, item) => {
      num += item.quantity.amount;
      return num;
    }, 0);

    return quantities.toFixed(2);
  }
}

export default Pantry;
