import { expect } from 'chai';

import Recipe from '../src/recipe.js';
import recipeData from '../src/data/recipes.js';
import ingredientsData from '../src/data/ingredients.js';

let recipe;

describe('Recipe', () => {
  beforeEach(() => {

    recipe = new Recipe(recipeData[47], ingredientsData);
  });

  describe('Recipe Data', () => {

    it('Should hold its own ingredient data', () => {
      expect(recipe.ingredients).to.equal(recipeData[47].ingredients);
    })

    it('Should hold its own instruction data', () => {
      expect(recipe.instructions).to.equal(recipeData[47].instructions);
    })
  })

  it('Should be able to calculate the cost of its ingredients', () => {
    // console.log(ingredientsData);
    expect(recipe.calculateCost()).to.equal(4166);
  });
  it('Should be able to calculate the cost of an ingredient', () => {
    // console.log(recipe);
    expect(recipe.findCost(1041009)).to.equal(850);
  });


});
