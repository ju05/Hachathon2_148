const {
  addCommentDB,
  getCommentsByRecipeIdDB,
} = require("../models/commentModel");

const addComment = async (req, res) => {
  const { recipe_id, user_id, content } = req.body;

  try {
    if (!content || content.trim() === "") {
      return res.status(400).json({ messahe: "Content is required" });
    }
    const newComment = await addCommentDB(recipe_id, user_id, content);
    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

const getCommentsByRecipeId = async (req, res) => {
  const { recipe_id } = req.params;

  try {
    const comments = await getCommentsByRecipeIdDB(recipe_id);
    res.json({ comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: "Server error while retrieving comments" });
  }
};

module.exports = { addComment, getCommentsByRecipeId };
