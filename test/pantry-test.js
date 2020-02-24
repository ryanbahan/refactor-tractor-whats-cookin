import { expect } from "chai";

import Pantry from "../src/pantry.js";

let pantry;
let recipes;
let savedRecipes;
let ingredientsData;

describe("Pantry", () => {
  beforeEach(() => {
    let userIngredients = [
      { ingredient: 19335, name: "sucrose", estimatedCostInCents: 902, amount: 2 },
      { ingredient: 20081, name: "wheat flour", estimatedCostInCents: 142, amount: 4 },
      {
        ingredient: 18371,
        name: "baking powder",
        estimatedCostInCents: 346,
        amount: 3
      },
      { ingredient: 1123, name: "eggs", estimatedCostInCents: 472, amount: 3 },

    ];
    pantry = new Pantry(userIngredients);
    savedRecipes = [0];
    ingredientsData = {ingredientsData:[
        {
          "id": 20081,
          "name": "wheat flour",
          "estimatedCostInCents": 142
        },
        {
          "id": 18371,
          "name": "bicarbonate of soda",
          "estimatedCostInCents": 582
        },
        {
          "id": 1123,
          "name": "eggs",
          "estimatedCostInCents": 472
        },
        {
          "id": 19335,
          "name": "sucrose",
          "estimatedCostInCents": 902
        },
        {
          "id": 19206,
          "name": "instant vanilla pudding",
          "estimatedCostInCents": 660
        }]}
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
    it("Should return false if there is not sufficient ingredients", () => {
      expect(pantry.prepareIngredients(1, recipes)).to.equal(false);
    });
    it("Should return list of ingredients if there is sufficient ingredients to cook", () => {
        let ingredients = [{
            userID:14,
            ingredientID:19335,
            ingredientModification:1
        },{
            userID:14,
            ingredientID:1123,
            ingredientModification:1
        }]
        expect(pantry.prepareIngredients(0, recipes,14)).to.deep.equal(ingredients);
    });
  });

  describe("Pantry fetchUpdate", () => {
    it("Should get needed Ingredients", () => {
      expect(pantry.getPantryInfo(ingredientsData)).to.equal(false);
    });

  });
});
