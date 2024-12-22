const express = require("express");
const cors = require("cors");
const { recipeRouter } = require("./routes/recipeRoute.js");
const path = require("path");
const app = express();
const authRoute = require("./routes/authRoute.js");
const commentRoutes = require("./routes/commentRoutes");
const favoriteRecipeRoutes = require("./routes/favoriteRoute");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoute);
app.use("/comments", commentRoutes);
app.use("/recipes", recipeRouter);
app.use("/favorite", favoriteRecipeRoutes);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listenning on port ${PORT}`);
});

app.use(cors());

app.use("/recipes", recipeRouter);
