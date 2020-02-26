const chai = require("chai"),
  spies = require("chai-spies");
chai.use(spies);
import { expect } from "chai";

import Recipe from '../src/recipe.js';
import recipeData from '../src/data/recipes.js';
import ingredientsData from '../src/data/ingredients.js';
import Cookbook from '../src/cookbook.js';
import Pantry from '../src/pantry.js'
import User from '../src/user.js'
let user1, recipe,pantry;
global.localStorage = {};

describe('User', () => {

  beforeEach(() => {
    pantry = [{"ingredient":11477,"amount":4},{"ingredient":11297,"amount":4}]
    recipe = new Recipe(recipeData[0], ingredientsData)
    user1 = new User(1, 'Boba', pantry);
  });

  it('Should have a cookbook', () => {
    expect(user1.cookbook).to.be.a('object');
  });

  it('Should have a pantry', () => {
    expect(user1.pantry).to.be.a('object');
    
  });
});
