const { db } = require("../config/data");

const registerUser = async (userData) => {
  return db("users").insert(userData).returning("*");
};

const findUserByUsername = async (username) => {
  return db("users").where({ username }).first();
};

const findUserByEmail = async (email) => {
  return db("users").where({ email }).first();
};

const findFavoritesByUsername = async (username) => {
  const favorites = await db("favoriterecipes")
    .where({ username })
    .select("recipe_id");
  return favorites.map((fav) => fav.recipe_id);
};

module.exports = {
  registerUser,
  findUserByUsername,
  findUserByEmail,
  findFavoritesByUsername,
};
