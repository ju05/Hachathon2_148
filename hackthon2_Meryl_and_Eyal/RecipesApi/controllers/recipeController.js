const {
  getRecipesDB,
  getRecipesByUsernameDB,
  getRecipeByIDDB,
  postRecipeDB,
  updateRecipeDB,
  deleteRecipeDB,
  getAllCategoriesDB,
  getCategoriesByRecipeDB,
  getRecipesCategoriesDB
} = require("../models/recipeModel.js");

const getAllRecipies = async (req, res) => {
  try {
    const response = await getRecipesDB();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
};

const getRecipesByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await getRecipesByUsernameDB(username);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
};

const getRecipeByID = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await getRecipeByIDDB(id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
};

const postRecipe = async (req, res) => {
  const { username, title, description, is_vegan, picture_url, ingredients } =
    req.body;
  const recipe = {
    username,
    title,
    description,
    is_vegan,
    picture_url,
    ingredients,
  };
  try {
    const response = await postRecipeDB(recipe);
    res.json({ message: "The recipe has been successfully posted!" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
};

const updateRecipe = async (req, res) => {
  const { recipe_id, title, description, is_vegan, picture_url, ingredients } =
    req.body;
  const updatedRecipe = {
    recipe_id,
    title,
    description,
    is_vegan,
    picture_url,
    ingredients,
  };
  try {
    const response = await updateRecipeDB(updatedRecipe);
    res.json({ message: "The recipe has been successfully updated!" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteRecipeDB(id);
    res.json({ message: "The recipe has been successfully deleted!" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const response = await getAllCategoriesDB();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
}

const getCategoriesByRecipe = async (req, res) => {
  const {id} = req.params
  try {
    const response = await getCategoriesByRecipeDB(id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
}

const getRecipesCategories = async (req, res) => {
  try {
    const response = await getRecipesCategoriesDB();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal Serveur Error" });
  }
}

module.exports = {
  getAllRecipies,
  getRecipesByUsername,
  getRecipeByID,
  postRecipe,
  updateRecipe,
  deleteRecipe,
  getCategories,
  getCategoriesByRecipe,
  getRecipesCategories
};
