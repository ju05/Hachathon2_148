const { db } = require("../config/data");

const getCommentsByRecipeIdDB = async (recipeId) => {
  return await db("comments")
    .join("users", "comments.user_id", "=", "users.user_id")
    .select(
      "comments.comment_id",
      "users.username",
      "comments.content",
      "comments.created_at"
    )
    .where("comments.recipe_id", recipeId);
};

const addCommentDB = async (recipe_id, user_id, content) => {
  try {
    const result = await db("comments")
      .insert({
        recipe_id: recipe_id,
        user_id: user_id,
        content: content,
      })
      .returning("*");

    return result;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
module.exports = { addCommentDB, getCommentsByRecipeIdDB };
