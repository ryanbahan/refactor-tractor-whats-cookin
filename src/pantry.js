class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  prepareIngredients(recipeID,recipes){
    console.log(this.contents)
    let preparingRecipe = recipes.find((recipe) => {
      return recipe.id == recipeID;
    })
    let ingredientsNeeded = preparingRecipe.ingredients;
    //Remove Duplicates
    ingredientsNeeded = ingredientsNeeded.reduce((list,ingredient,index) => {
      let firstIndex = ingredientsNeeded.findIndex((item)=>{return item.id === ingredient.id;})
      console.log(ingredientsNeeded[firstIndex])
      console.log(ingredient)
      if(firstIndex<index){

        ingredientsNeeded[firstIndex].quantity.amount += ingredient.quantity.amount;
      } else {
        list.push(ingredient)
      }
      return list;
    }, [])

    let isMissingIngredients = ingredientsNeeded.reduce((isMissing,ingredient)=>{
      let pantryIngredient = this.contents.find(item=>item.id == ingredient.id);
      if(pantryIngredient){
        isMissing = pantryIngredient.amount < ingredient.quantity.amount;
      } else {
        isMissing =true;
      }
      return isMissing;
    },false);
    return isMissingIngredients;
  }

  getPantryInfo(ingredientsData) {
    this.contents = this.contents.map(ingredient => {

      let ingredientData = ingredientsData.ingredientsData.find(item => {
        return item.id === ingredient.ingredient
      })

      ingredientData.amount = ingredient.amount

      return ingredientData;
    })

    this.contents = this.contents.filter(item => item !== undefined);
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

    let missingIngredients = ingredientsNeeded.reduce((list, ingredient) => {
      if (this.contents.find(item => item.id == ingredient.id)) {
        let ingredientInPantry = this.contents.find(item => item.id == ingredient.id);
        if (ingredientInPantry.amount >= ingredient.quantity.amount) {
          // console.log('not needed');
        } else {

          let ingredientDelta = {
            id: ingredient.id,
            estimatedCostInCents: ingredient.estimatedCostInCents,
            name: ingredient.name,
            unit: ingredient.quantity.unit,
            quantity: {
              amount: ingredient.quantity.amount - ingredientInPantry.amount,
              unit: ingredient.quantity.unit
            }

          };
          list.push(ingredientDelta);
          // console.log('needed', ingredient.quantity.amount, ingredientInPantry.amount, ingredientDelta);
        }
      } else {
        list.push(ingredient);
      }
      return list;
    }, []);

    // add cost to ingredients
    missingIngredients = missingIngredients.map(item => {
      item.cost = (item.quantity.amount * item.estimatedCostInCents / 100).toFixed(2);
      return item;
    })

    // get total cost of items
    let totalCost = missingIngredients.reduce((num, item) => {
      num += parseFloat(item.cost);
      return num;
    }, 0)

    totalCost = totalCost.toFixed(2);

    // get total quantity of items
    let quantities = missingIngredients.reduce((num, item) => {
      num += item.quantity.amount;
      return num;
    }, 0)

    quantities = quantities.toFixed(2);


    return [missingIngredients, totalCost, quantities];
  }
}

export default Pantry;
