class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }
  getNeededIngredients(savedRecipes, pantry, recipes) {
    let ingredientsNeeded = savedRecipes.map(recipe => recipes.find(item => item.id == recipe))
                                .map(item => item = item.ingredients)
                                .flat();

    ingredientsNeeded = ingredientsNeeded.reduce((list, item) => {
      if (list.find(recipe => recipe.id == item.id)) {
        let listItem = list.find(recipe => recipe.id == item.id);
        listItem.quantity.amount += item.quantity.amount;
      } else {
        list.push(item);
      }

      return list;
    }, [])

    ingredientsNeeded = ingredientsNeeded.map(item => {
      item.cost = (item.quantity.amount * item.estimatedCostInCents / 100).toFixed(2);
      return item;
    })

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
