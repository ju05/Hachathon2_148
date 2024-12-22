const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");

const register = async (req, res) => {
  const { first_name, last_name, email, username, password } = req.body;

  try {
    const existingUsername = await authModel.findUserByUsername(username);
    const existingUser = await authModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await authModel.registerUser({
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.status(201).redirect("/login.html");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while saving" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const favoriteRecipes = await authModel.findFavoritesByUsername(username);
    return res.json({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      favoriteRecipes: favoriteRecipes,
    });
  } catch (error) {
    console.error("Error connecting: ", error);
    res
      .status(500)
      .json({ message: "An error occurred on the server. Please try again." });
  }
};

module.exports = { register, login };
