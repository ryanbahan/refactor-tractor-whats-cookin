const chai = require("chai"),
  spies = require("chai-spies");
chai.use(spies);
import { expect } from "chai";

import recipeData from "../src/data/recipes.js";
import Cookbook from "../src/cookbook.js";
import Recipe from "../src/recipe.js";

let cookbook;
let userID;
let recipe;
let savedRecipes;
let favoriteRecipes;
global.localStorage = {};

describe("Cookbook", () => {
  beforeEach(() => {
    userID = "1";
    // recipe = new Recipe(recipeData[0], ingredientsData)
  });
  describe("LocalStorage", () => {
    it("Should start off as an empty array of favorites", () => {
      chai.spy.on(localStorage, ["setItem", "getItem"], () => {
        return JSON.stringify({ favorites: [], savedRecipes: [] });
      });
      cookbook = new Cookbook(userID);
      expect(localStorage.getItem).to.be.called(1);
      expect(cookbook.favoriteRecipes).to.be.an("array");
      expect(cookbook.favoriteRecipes).to.deep.equal([]);
    });

    it("Should start off as an empty array of saved recipes", () => {
      expect(localStorage.getItem).to.be.called(1);
      expect(cookbook.savedRecipes).to.be.an("array");
      expect(cookbook.savedRecipes).to.deep.equal([]);
    });

    it("Should be able to save itself", () => {
      cookbook = new Cookbook(userID);
      cookbook.savedRecipes = [3, 4];
      cookbook.favoriteRecipes = [1, 2];
      let expected = JSON.stringify({
        favorites: cookbook.favoriteRecipes,
        savedRecipes: cookbook.savedRecipes
      });
      cookbook.save();
      expect(localStorage.setItem).to.be.called.with(expected);
    });
  });

  describe("Update", () => {
    it("should be able to update the saved recipe array", () => {
      cookbook = new Cookbook(userID);
      cookbook.savedRecipes = [3, 4];
      let recipeID = 3;
      cookbook.updateSavedRecipes(recipeID);

      expect(cookbook.savedRecipes).to.deep.equal([4]);
    });

    it("should be able to update the favorite recipe array", () => {
      cookbook = new Cookbook(userID);
      cookbook.favoriteRecipes = [1, 2];
      let recipeID = 1;
      cookbook.updateFavorites(recipeID);

      expect(cookbook.favoriteRecipes).to.deep.equal([2]);
    });
  });

  describe("Cook", () => {
    it("should be able to remove a saved recipe when cooked", () => {
      cookbook = new Cookbook(userID);
      cookbook.savedRecipes = [3, 4];
      let recipeID = 3;
      cookbook.cook(recipeID);

      expect(cookbook.savedRecipes).to.deep.equal([4]);
    });
  });

  describe("Is Saved", () => {
    it("Should return true when it exists", () => {
      cookbook = new Cookbook(userID);
      cookbook.savedRecipes = [3, 4];
      let recipeID = 3;

      expect(cookbook.isSaved(recipeID)).to.equal(true);
    });

    it("Should return false when it does not", () => {
      cookbook = new Cookbook(userID);
      cookbook.savedRecipes = [3, 4];
      let recipeID = 6;
      expect(cookbook.isSaved(recipeID)).to.equal(false);
    });
  });
});
