const express = require("express");
const authController = require("../controllers/authController");
const commentsController = require("../controllers/commentController.js");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;
