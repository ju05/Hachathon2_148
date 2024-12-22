const user = JSON.parse(localStorage.getItem("user"));
const { username, user_id, first_name } = user;

const usernameRecipe = document.getElementById("usernameFavorites");
usernameRecipe.textContent = `${first_name}'s favorites`;
let favRecipes = [];
let categoriesData = [];
let recipeCategoriesData = [];

const logoutButton = document.getElementById("logout-btn");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/login.html";
});
const preloadCategories = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/recipes/all/categories"
    );
    categoriesData = await response.json();
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }

  try {
    const response = await fetch(
      "http://localhost:3000/recipes/api/categories"
    );
    recipeCategoriesData = await response.json();
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};
preloadCategories();

const handleSearchInput = (event) => {
  const searchTerm = event.target.value.toLowerCase();

  const filteredRecipes = favRecipes.filter((recipe) => {
    const inTitle = recipe.title.toLowerCase().includes(searchTerm);
    const inIngredients = recipe.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm)
    );
    const inUsername = recipe.username.toLowerCase().includes(searchTerm);

    // Filter and map categories for the recipe
    const recipeCategoryMappings = recipeCategoriesData.filter((rc) => {
      return rc.recipe_id === recipe.recipe_id;
    });

    const linkedCategories = recipeCategoryMappings
      .map((rc) => {
        const category = categoriesData.find(
          (cat) => cat.category_id === rc.category_id
        );
        return category ? category.name : null;
      })
      .filter(Boolean); // Remove null values

    // Check if any linked category matches the search term
    const inCategorie = linkedCategories.some((category) =>
      category.toLowerCase().includes(searchTerm)
    );

    return inTitle || inIngredients || inUsername || inCategorie;
  });

  renderRecipes(filteredRecipes, favRecipes);
};

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", handleSearchInput);

async function getUserFavorites() {
  try {
    const response = await fetch(`http://localhost:3000/favorite/${username}`);
    if (response.ok) {
      favRecipes = await response.json();
      renderRecipes(favRecipes);

      const searchInput = document.getElementById("search");
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredRecipes = favRecipes.filter((recipe) => {
          const inTitle = recipe.title.toLowerCase().includes(searchTerm);
          const inIngredients = recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm)
          );
          return inTitle || inIngredients;
        });
        renderRecipes(filteredRecipes);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
getUserFavorites();

function renderRecipes(arr) {
  const recipeSection = document.getElementById("allfavorites");
  recipeSection.innerHTML = "";
  arr.forEach((recipe) => {
    const div = document.createElement("div");
    div.setAttribute("data-recipe-id", recipe.recipe_id);
    div.className = "onerecipe";
    div.innerHTML = `<img src="${recipe.picture_url}" alt="picture">
              <p>${recipe.title} by ${recipe.username}</p>
              <a href="recipe.html?id=${recipe.recipe_id}">Link to the recipe</a>
              <span class="like-heart" data-liked="true">❤️</span>
              `;

    recipeSection.appendChild(div);

    const categorieUl = document.createElement("ul");
    const categories = getCategoriesbyRecipeID(recipe.recipe_id).then(
      (categorieArr) => {
        categorieArr.forEach((categorie) => {
          const li = document.createElement("li");
          li.textContent = `${categorie.name}`;
          categorieUl.appendChild(li);
        });
      }
    );
    div.appendChild(categorieUl);

    if (recipe.is_vegan) {
      const vegan = document.createElement("p");
      vegan.textContent = "🌱 Vegan";
      div.appendChild(vegan);
    }

    const heart = div.querySelector(".like-heart");
    heart.addEventListener("click", () => {
      const recipeId = div.getAttribute("data-recipe-id");
      const username = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).username
        : null;
      const isLiked = heart.getAttribute("data-liked") === "true";

      if (username) {
        if (isLiked) {
          removeFavorite(username, recipeId);
          location.reload();
        } else {
          addFavorite(username, recipeId);
          location.reload();
        }

        heart.setAttribute("data-liked", !isLiked);
        heart.classList.toggle("liked");
      }
    });
  });
}

async function addFavorite(username, recipe_id) {
  try {
    const response = await fetch("http://localhost:3000/favorite/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        recipe_id: recipe_id,
      }),
    });
    if (response.ok) {
      console.log("Recipe added to favorites");
    }
  } catch (error) {
    console.log("Error adding favorite:", error);
  }
}

async function removeFavorite(username, recipe_id) {
  try {
    const response = await fetch(
      `http://localhost:3000/favorite/remove/${username}/${recipe_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          recipe_id: recipe_id,
        }),
      }
    );
    if (response.ok) {
      console.log("Recipe removed from favorites");
    } else {
      console.log("Failed to remove recipe from favorites");
    }
  } catch (error) {
    console.log("Error removing favorite:", error);
  }
}

async function getCategoriesbyRecipeID(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/recipes/all/categories/${id}`
    );
    if (response.ok) {
      const categories = await response.json();
      return categories;
    } else {
      return { message: "Error during the getCategorie" };
    }
  } catch (error) {
    console.log(error);
  }
}
