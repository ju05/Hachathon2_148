const {
  addFavorite,
  removeFavorite,
  getFavoritesByUsername,
} = require("../models/favoriteModel");

const addFavoriteRecipe = async (req, res) => {
  const { username, recipe_id } = req.body;
  try {
    await addFavorite(username, recipe_id);
    res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error adding recipe to favorites" });
  }
};

const getFavoritesRecipes = async (req, res) => {
  const { username } = req.params;
  try {
    const favoriteRecipes = await getFavoritesByUsername(username);
    res.status(200).json(favoriteRecipes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving favorite recipes" });
  }
};

const removeFavoriteRecipe = async (req, res) => {
  const { username, recipe_id } = req.params;
  try {
    await removeFavorite(username, recipe_id);
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error removing recipe from favorites" });
  }
};

module.exports = {
  addFavoriteRecipe,
  getFavoritesRecipes,
  removeFavoriteRecipe,
};
