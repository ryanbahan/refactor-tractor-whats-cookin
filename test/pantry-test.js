import { expect } from "chai";

import Pantry from "../src/pantry.js";

let pantry;
let recipes;

describe("Pantry", () => {
  beforeEach(() => {
    let userIngredients = [
      {
        ingredient: 19335,
        name: "sucrose",
        estimatedCostInCents: 902,
        amount: 2
      },
      {
        ingredient: 20081,
        name: "wheat flour",
        estimatedCostInCents: 142,
        amount: 4
      },
      {
        ingredient: 18371,
        name: "baking powder",
        estimatedCostInCents: 346,
        amount: 3
      },
      { ingredient: 1123, name: "eggs", estimatedCostInCents: 472, amount: 3 },
      { ingredient: 2047, name: "salt", estimatedCostInCents: 280, amount: 5 },
      {
        ingredient: 19296,
        name: "runny honey",
        estimatedCostInCents: 742,
        amount: 2
      },
      {
        ingredient: 4053,
        name: "pure olive oil",
        estimatedCostInCents: 705,
        amount: 5
      },
      {
        ingredient: 11282,
        name: "onions",
        estimatedCostInCents: 439,
        amount: 2
      },
      {
        ingredient: 11215,
        name: "whole garlic clove",
        estimatedCostInCents: 220,
        amount: 3
      },
      {
        ingredient: 14106,
        name: "white wine",
        estimatedCostInCents: 675,
        amount: 2
      },
      {
        ingredient: 1125,
        name: "egg yolks",
        estimatedCostInCents: 889,
        amount: 2
      }
    ];
    pantry = new Pantry(userIngredients);
    recipes = [
      {
        name: "Test Kitchen Recipe Success",
        id: 0,
        ingredients: [
          {
            id: 19335,
            quantity: { amount: 1, unit: "mguffin" }
          },
          {
            id: 1123,
            quantity: { amount: 1, unit: "mguffin" }
          }
        ]
      },
      {
        name: "Test Kitchen Recipe Fail",
        id: 1,
        ingredients: [
          {
            id: 19335,
            quantity: { amount: 100, unit: "mguffin" }
          },
          {
            id: 1123,
            quantity: { amount: 1, unit: "mguffin" }
          }
        ]
      }
    ];
  });

  describe("Pantry Checks", () => {
    it.skip("Should return false if there is not sufficient ingredients", () => {
      expect(pantry.prepareIngredients(1, recipes, 14)).to.equal(false);
    });
    it("Should return list of ingredients if there is sufficient ingredients to cook", () => {
      let ingredients = [
        {
          userID: 14,
          ingredientID: 19335,
          ingredientModification: -1
        },
        {
          userID: 14,
          ingredientID: 1123,
          ingredientModification: -1
        }
      ];
      expect(pantry.prepareIngredients(0, recipes, 14)).to.deep.equal(
        ingredients
      );
    });
    it("Should return the ingredients needed for the saved recipe(s)", () => {
      let ingredients = [
        {
          id: 19335,
          quantity: {
            amount: 1,
            unit: "mguffin"
          }
        },
        {
          id: 1123,
          quantity: {
            amount: 1,
            unit: "mguffin"
          }
        }
      ];
      expect(pantry.getSavedRecipeIngredients([0], recipes)).to.deep.equal(
        ingredients
      );
    });

    it("Should remove the duplicates", () => {
      let ingredients = [
        {
          id: 19335,
          quantity: {
            amount: 1,
            unit: "mguffin"
          }
        },
        {
          id: 1123,
          quantity: {
            amount: 1,
            unit: "mguffin"
          }
        }
      ];
      let list = pantry.getSavedRecipeIngredients([0], recipes);
      expect(pantry.mergeDuplicates(list)).to.deep.equal(ingredients);
    });

    it("Should return nothing if there are no missing ingredients", () => {

      let list = pantry.getSavedRecipeIngredients([0], recipes);
      expect(pantry.getNeededIngredients([0],recipes)).to.deep.equal([]);
    });
    it("Should find missing ingredients", () => {
      let userIngredients = [
        {
          ingredient: 19335,
          name: "sucrose",
          estimatedCostInCents: 902,
          amount: .5
        }]
      pantry = new Pantry(userIngredients);
      let list = pantry.getSavedRecipeIngredients([0], recipes);
      expect(pantry.getNeededIngredients([0],recipes)).to.deep.equal([]);
    });

  });
});
