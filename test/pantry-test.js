import { expect } from "chai";

import Pantry from "../src/pantry.js";
import ingredientData from "../src/data/ingredients.js";
let pantry, recipes, formattedPantry, ingredients;

describe("Pantry", () => {
  beforeEach(() => {

    formattedPantry = [
      { id: 19335, name: "sucrose", estimatedCostInCents: 902, amount: 2 },
      {
        id: 20081,
        name: "wheat flour",
        estimatedCostInCents: 142,
        amount: 4
      },
      {
        id: 18371,
        name: "baking powder",
        estimatedCostInCents: 346,
        amount: 3
      },
      { id: 1123, name: "eggs", estimatedCostInCents: 472, amount: 3 },
      { id: 2047, name: "salt", estimatedCostInCents: 280, amount: 5 },
      {
        id: 19296,
        name: "runny honey",
        estimatedCostInCents: 742,
        amount: 2
      },
      {
        id: 4053,
        name: "pure olive oil",
        estimatedCostInCents: 705,
        amount: 5
      },
      { id: 11282, name: "onions", estimatedCostInCents: 439, amount: 2 },
      {
        id: 11215,
        name: "whole garlic clove",
        estimatedCostInCents: 220,
        amount: 3
      },
      {
        id: 14106,
        name: "white wine",
        estimatedCostInCents: 675,
        amount: 2
      },
      { id: 1125, name: "egg yolks", estimatedCostInCents: 889, amount: 2 }
    ];
    let userIngredients = [
      { ingredient: 19335, amount: 2 },
      { ingredient: 20081, amount: 4 },
      { ingredient: 18371, amount: 3 },
      { ingredient: 1123, amount: 3 },
      { ingredient: 2047, amount: 5 },
      { ingredient: 19296, amount: 2 },
      { ingredient: 4053, amount: 5 },
      { ingredient: 11282, amount: 2 },
      { ingredient: 11215, amount: 3 },
      { ingredient: 14106, amount: 2 },
      { ingredient: 1125, amount: 2 }
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

    ingredients =  [
      {
        "id": 19335,
        "quantity": {
          "amount": 100,
          "unit": "mguffin"
        }
      },
      {
        "id": 1123,
        "quantity": {
          "amount": 1,
          "unit": "mguffin"
        }
      }
  ];
  });
  describe("Pantry Checks", () => {
    it("Should return false if there is not sufficient ingredients", () => {
      pantry.getPantryInfo(ingredientData);
      expect(pantry.checkIfCookable(recipes, 1)).to.equal(false);
    });
    it("Should return a formatted pantry", () => {
      pantry.getPantryInfo(ingredientData);
      expect(pantry.contents).to.deep.equal(formattedPantry);
    });
    it("Should return the required ingredients", () => {
      pantry.getPantryInfo(ingredientData);
      expect(pantry.getNeededIngredients(['0'], recipes)).to.deep.equal([[],'0.00','0.00']);
    });
    it("getSavedRecipeIngredients should return an the recipe ingredients ", () => {

      pantry.getPantryInfo(ingredientData);
      expect(pantry.getSavedRecipeIngredients(['1'], recipes)).to.deep.equal(
        [
            {
                "id": 19335,
                "quantity": {
                  "amount": 100,
                  "unit": "mguffin"
                }},
              {
                "id": 1123,
                "quantity": {
                  "amount": 1,
                  "unit": "mguffin"
                }
              }
            ]
        );
    });

    it("Should be able to find missing ingredients", () => {
      pantry.getPantryInfo(ingredientData);
      // console.log(pantry.contents)

      expect(pantry.findMissingIngredients(ingredients)).to.deep.equal([   {
            "estimatedCostInCents": 902,
            "id": 19335,
            "name": "sucrose",
            "quantity": {
              "amount": 98,
              "unit": "mguffin"
            }
          }]);
    });

  });
  it("addCost to Ingredients", () => {
    pantry.getPantryInfo(ingredientData);
    let totalIngredientsNeeded = pantry.getSavedRecipeIngredients(['1'], recipes)
    let missingIngredients= pantry.findMissingIngredients(totalIngredientsNeeded)
    expect(pantry.addCostToIngredients(missingIngredients)).to.deep.equal(
        [{
            "cost": "883.96",
            "estimatedCostInCents": 902,
            "id": 19335,
            "name": "sucrose",
            "quantity": {
              "amount": 98,
              "unit": "mguffin"
            }
          }]
    );
  });

  it("Get Total Quanitites", () => {
    pantry.getPantryInfo(ingredientData);
    let totalIngredientsNeeded = pantry.getSavedRecipeIngredients(['1'], recipes)
    let missingIngredients= pantry.findMissingIngredients(totalIngredientsNeeded)
    expect(pantry.getTotalQuantities(missingIngredients)).to.deep.equal('98.00');
  });

});
