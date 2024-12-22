const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/add", commentController.addComment);

router.get("/:recipe_id", commentController.getCommentsByRecipeId);

module.exports = router;
