class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }
  getNeededIngredients(savedRecipes, recipes) {
    // get recipe ingredients from ID's
    let ingredientsNeeded = savedRecipes.map(recipe => recipes.find(item => item.id == recipe))
                                .map(item => item = item.ingredients)
                                .flat();
      // remove duplicates
    ingredientsNeeded = ingredientsNeeded.reduce((list, item) => {
      if (list.find(recipe => recipe.id == item.id)) {
        let listItem = list.find(recipe => recipe.id == item.id);
        listItem.quantity.amount += item.quantity.amount;
      } else {
        list.push(item);
      }

      return list;
    }, [])

    // add cost to ingredients
    ingredientsNeeded = ingredientsNeeded.map(item => {
      item.cost = (item.quantity.amount * item.estimatedCostInCents / 100).toFixed(2);
      return item;
    })

    let missingIngredients = ingredientsNeeded.reduce((list, ingredient) => {
      if (this.contents.find(item => item.id == ingredient.id)) {
        // console.log(this.contents.find(item => item.id == ingredient.id));
        let ingredientDelta = null;
        // console.log('in pantry', ingredient);
      } else {
        list.push(ingredient);
      }
      return list;
    }, [])

    // console.log('needed', ingredientsNeeded);
    // console.log('pantry', this.contents);







    let totalCost = ingredientsNeeded.reduce((num, item) => {
      num += parseFloat(item.cost);
      return num;
    }, 0)

    totalCost = totalCost.toFixed(2);

    let quantities = ingredientsNeeded.reduce((num, item) => {
      num += item.quantity.amount;
      return num;
    }, 0)

    quantities = quantities.toFixed(2);


    return [ingredientsNeeded, totalCost, quantities];
  }
}

export default Pantry;
