const { db } = require("../config/data");

const addFavorite = async (username, recipe_id) => {
  try {
    const result = await db("favoriterecipes").insert({
      username: username,
      recipe_id: recipe_id,
    });
    return result;
  } catch (error) {
    console.error("Error adding in favorite:", error);
    throw error;
  }
};

const getFavoritesByUsername = async (username) => {
  try {
    const favoriterecipes = await db("favoriterecipes")
      .join("recipes", "favoriterecipes.recipe_id", "=", "recipes.recipe_id")
      .where("favoriterecipes.username", username)
      .select("recipes.*");
    return favoriterecipes;
  } catch (error) {
    console.error("Error retrieving favorite recipes:", error);
    throw error;
  }
};

const removeFavorite = async (username, recipe_id) => {
  try {
    return db("favoriterecipes")
      .where("username", username)
      .andWhere("recipe_id", recipe_id)
      .del();
  } catch (error) {
    console.error("Error removing favorite recipe:", error);
    throw error;
  }
};

module.exports = { addFavorite, getFavoritesByUsername, removeFavorite };
