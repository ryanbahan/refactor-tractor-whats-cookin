const chai = require("chai"),
  spies = require("chai-spies");
chai.use(spies);
import { expect } from "chai";


import Recipe from '../src/recipe.js';
import recipeData from "../src/data/recipes.js";
import DatabaseController from '../src/databaseController.js';

let database, recipe, recipesData;


describe('Recipe', () => {
  beforeEach(() => {

    database = new DatabaseController();

    recipesData = database.getIngredients();

    recipe = new Recipe(recipeData);
  });

  describe('Recipe Data', () => {

    it('Should hold its own ingredient data', () => {
      expect(recipe.ingredients).to.equal(recipesData.ingredients);
    });

    it('Should hold its own instruction data', () => {
      expect(recipe.instructions).to.equal(recipesData.instructions);
    });

    // it('Should be able to get ingredients info', () => {
    //   expect(recipe.getIngredientsInfo()).to.equal(ingredient);
    // });
    
  });

});
