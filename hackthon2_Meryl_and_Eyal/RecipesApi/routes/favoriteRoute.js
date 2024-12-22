const express = require("express");
const router = express.Router();
const {
  addFavoriteRecipe,
  getFavoritesRecipes,
  removeFavoriteRecipe,
} = require("../controllers/favoriteController");

router.post("/add", addFavoriteRecipe);

router.get("/:username", getFavoritesRecipes);

router.delete("/remove/:username/:recipe_id", removeFavoriteRecipe);

module.exports = router;
