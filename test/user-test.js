import {
  expect
} from 'chai';

import Recipe from '../src/recipe.js';
import recipeData from '../src/data/recipes.js';
import ingredientsData from '../src/data/ingredients.js';
import Cookbook from '../src/cookbook';
import Pantry from '../src/pantry'

let user1, recipe;

describe('User', () => {
  global.localStorage = {
    store: {},
    setItem(keyName, value) {
      this.store[keyName] = value;
    },
  
    getItem(keyName) {
      return this.store[keyName]
    }
  }
  beforeEach(() => {
    recipe = new Recipe(recipeData[0], ingredientsData)
    user1 = new User(1, 'Boba', pantry);
  });

  it('Should have a cookbook', () => {
    expect(user1.cookbook.favoriteRecipes).to.eql([]);
  });

  it('Should be able to add recipes to favoriteRecipes', () => {
    user1.addToFavorites(recipeData[0])
    expect(user1.cookbook.favoriteRecipes.includes(recipeData[0])).to.eql(true);
  });

  it('Should be able to remove recipes from favoriteRecipes', () => {
    user1.removeFromFavorites(recipeData);
    expect(user1.favoriteRecipes).to.eql([]);
  });

  it('Should be able to filter through favoriteRecipes by tag', () => {
    user1.addToFavorites(recipeData[0]);
    user1.addToFavorites(recipeData[1]);
    expect(user1.filterFavorites('antipasti')).to.eql([recipeData[0]]);
  });

  it('Should be able to search favoriteRecipes by name or ingredient', () => {
    user1.addToFavorites(recipeData[0]);
    user1.addToFavorites(recipeData[1]);

    expect(user1.findFavorites('egg')).to.eql([recipeData[0]]);
  });

  it.skip('Should be able to save favorites', () => {
    expect(user1.saveFavorites()).to.have.been.called(2);
  });
  // it('Should be able to check ingredients in User/s pantry for a given recipe', () => {
  //   let recipeIngredients = recipeData[0].ingredients;
  //   expect(user1.checkPantry(recipeIngredients)).to.eql('You do not have the ingredients!');
  // });

  it.skip('Should inform User if they lack required ingredients for a given recipe', () => {
    let missingIngredientsWithPrice = [{
        name: 'all purpose flour',
        quantity: {
          amount: 1.5,
          unit: 'c'
        },
        cost: 213
      },
      {
        name: 'baking soda',
        quantity: {
          amount: 0.5,
          unit: 'tsp'
        },
        cost: 291
      },
      {
        name: 'egg',
        quantity: {
          amount: 1,
          unit: 'large'
        },
        cost: 472
      },
      {
        name: 'granulated sugar',
        quantity: {
          amount: 0.5,
          unit: 'c'
        },
        cost: 451
      },
      {
        name: 'instant vanilla pudding mix',
        quantity: {
          amount: 3,
          unit: 'Tbsp'
        },
        cost: 1980
      },
      {
        name: 'light brown sugar',
        quantity: {
          amount: 0.5,
          unit: 'c'
        },
        cost: 279.5
      },
      {
        name: 'salt',
        quantity: {
          amount: 0.5,
          unit: 'tsp'
        },
        cost: 140
      },
      {
        name: 'sea salt',
        quantity: {
          amount: 24,
          unit: 'servings'
        },
        cost: 12672
      },
      {
        name: 'semisweet chocolate chips',
        quantity: {
          amount: 2,
          unit: 'c'
        },
        cost: 506
      },
      {
        name: 'vanilla extract',
        quantity: {
          amount: 0.5,
          unit: 'tsp'
        },
        cost: 463
      }
    ]
    expect(user1.checkPantry(recipe)).to.deep.eql(missingIngredientsWithPrice);
  });
});
