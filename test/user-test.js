import {
  expect
} from 'chai';

import User from '../src/user.js';
import Recipe from '../src/recipe.js';
import recipeData from '../src/data/recipes.js';
import ingredientsData from '../src/data/ingredients.js'

let user1, recipe;

describe('User', () => {
  beforeEach(() => {
    recipe = new Recipe(recipeData[0], ingredientsData)
    user1 = new User(1, 'Boba', [{
      'ingredient': 1077,
      'amount': 1
    }, {
      'ingredient': 14412,
      'amount': 1
    }, {
      'ingredient': 1009054,
      'amount': 3
    }, {
      'ingredient': 1145,
      'amount': 1
    }]);
  });

  it('Should have a property of favoriteRecipes with a default value', () => {
    expect(user1.favoriteRecipes).to.eql([]);
  });

  it('Should be able to add recipes to favoriteRecipes', () => {
    user1.addToFavorites(recipeData[0])
    expect(user1.favoriteRecipes.includes(recipeData[0])).to.eql(true);
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

  // it('Should be able to check ingredients in User/s pantry for a given recipe', () => {
  //   let recipeIngredients = recipeData[0].ingredients;
  //   expect(user1.checkPantry(recipeIngredients)).to.eql('You do not have the ingredients!');
  // });

  it('Should inform User if they lack required ingredients for a given recipe', () => {
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
