const user = JSON.parse(localStorage.getItem("user"));
const { username, user_id, first_name } = user;
let categoriesData = [];
let recipeCategoriesData = [];
let userRecipes = [];
const usernameRecipe = document.getElementById("usernameRecipe");
usernameRecipe.textContent = `${first_name}'s recipes`;

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
async function getRecipeByUsername() {
  try {
    const response = await fetch(`http://localhost:3000/recipes/${username}`);
    userRecipes = await response.json();
    renderRecipes(userRecipes);
  } catch (error) {
    console.log(error);
  }
}
getRecipeByUsername();
const handleSearchInput = (event) => {
  const searchTerm = event.target.value.toLowerCase();

  const filteredRecipes = userRecipes.filter((recipe) => {
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

  renderRecipes(filteredRecipes);
};
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", handleSearchInput);
function renderRecipes(arr) {
  const recipeSection = document.getElementById("userrecipes");
  recipeSection.innerHTML = "";
  arr.forEach((recipe) => {
    const div = document.createElement("div");
    div.setAttribute("data-recipe-id", recipe.recipe_id);
    div.className = "onerecipe";
    div.innerHTML = `<img src="${recipe.picture_url}" alt="picture">
          <p>${recipe.title} by ${recipe.username}</p>
          <a href="recipe.html?id=${recipe.recipe_id}">Link to the recipe</a>
          <button class="update-button">Update</button>
          <button class="delete-button">Delete</button><br>
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
      vegan.textContent = "Vegan";
      div.appendChild(vegan);
    }
    document.querySelectorAll(".update-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const recipeId = e.target
          .closest(".onerecipe")
          .getAttribute("data-recipe-id");
        openUpdateModal(recipeId);
      });
    });
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const recipeId = e.target
          .closest(".onerecipe")
          .getAttribute("data-recipe-id");
        deleteRecipe(recipeId);
      });
    });
  });
}
function openUpdateModal(recipeId) {
  const modal = document.getElementById("update-modal");
  modal.style.display = "block";
  fetch(`http://localhost:3000/recipes/recipe/${recipeId}`)
    .then((response) => response.json())
    .then((data) => {
      const recipe = data[0];
      document.getElementById("recipe-id").value = recipe.recipe_id;
      document.getElementById("update-title").value = recipe.title;
      document.getElementById("update-picture-url").value = recipe.picture_url;
      document.getElementById("update-is-vegan").value = recipe.is_vegan
        ? "true"
        : "false";
      populateDynamicFields(
        "update-ingredients-list",
        recipe.ingredients,
        "ingredient-update"
      );
      populateDynamicFields(
        "update-steps-list",
        recipe.description,
        "step-update"
      );
    })
    .catch((error) => console.error("Error fetching recipe:", error));
}
// Populate dynamic fields for ingredients or steps
function populateDynamicFields(containerId, items, className) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear existing fields
  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = `
            <input type="text" value="${item}" />
            <button type="button" class="remove-field">Remove</button>
        `;
    container.appendChild(div);
    div.querySelector(".remove-field").addEventListener("click", () => {
      container.removeChild(div);
    });
  });
}
// Add dynamic ingredient or step
document
  .getElementById("add-ingredient-update")
  .addEventListener("click", () => {
    const container = document.getElementById("update-ingredients-list");
    const div = document.createElement("div");
    div.className = "ingredient-update";
    div.innerHTML = `
        <input type="text" placeholder="New Ingredient" />
        <button type="button" class="remove-field">Remove</button>
    `;
    container.appendChild(div);
    div.querySelector(".remove-field").addEventListener("click", () => {
      container.removeChild(div);
    });
  });
document.getElementById("add-step-update").addEventListener("click", () => {
  const container = document.getElementById("update-steps-list");
  const div = document.createElement("div");
  div.className = "step-update";
  div.innerHTML = `
        <input type="text" placeholder="New Step" />
        <button type="button" class="remove-field">Remove</button>
    `;
  container.appendChild(div);
  div.querySelector(".remove-field").addEventListener("click", () => {
    container.removeChild(div);
  });
});
// Close modal
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("update-modal").style.display = "none";
});
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const overlay = document.getElementById("overlay");
const recipeModal = document.getElementById("recipeModal");
// Open modal
openModalBtn.addEventListener("click", () => {
  recipeModal.style.display = "block";
  overlay.style.display = "block";
});
// Close modal
const closeModal = () => {
  recipeModal.style.display = "none";
  overlay.style.display = "none";
};
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
const ingredientsList = document.getElementById("ingredients-list");
const descriptionList = document.getElementById("description-list");
document.addEventListener("DOMContentLoaded", () => {
  const ingredientTemplate = document.getElementById(
    "ingredient-template"
  ).content;
  const stepTemplate = document.getElementById("step-template").content;
  // Add Ingredient
  document.getElementById("add-ingredient").addEventListener("click", () => {
    const ingredientItem = document.importNode(ingredientTemplate, true);
    ingredientItem
      .querySelector(".remove-ingredient")
      .addEventListener("click", (e) => {
        e.target.closest("li").remove();
      });
    ingredientsList.appendChild(ingredientItem);
  });
  // Add Step
  document.getElementById("add-step").addEventListener("click", () => {
    const stepItem = document.importNode(stepTemplate, true);
    stepItem.querySelector(".remove-step").addEventListener("click", (e) => {
      e.target.closest("li").remove();
    });
    descriptionList.appendChild(stepItem);
  });
});
const updateForm = document.getElementById("update-recipe-form");
updateForm.addEventListener("submit", updateRecipe);
async function updateRecipe(e) {
  e.preventDefault();
  const recipeId = document.getElementById("recipe-id").value;

  const updatedRecipe = {
    recipe_id: recipeId,
    title: document.getElementById("update-title").value,
    picture_url: document.getElementById("update-picture-url").value,
    is_vegan: document.getElementById("update-is-vegan").value === "true",
    ingredients: Array.from(
      document.querySelectorAll("#update-ingredients-list input")
    ).map((input) => input.value),
    description: Array.from(
      document.querySelectorAll("#update-steps-list input")
    ).map((input) => input.value),
  };
  try {
    const response = await fetch(`http://localhost:3000/recipes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipe),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Recipe updated successfully!");
      document.getElementById("update-modal").style.display = "none";
      location.reload();
    } else {
      alert("Failed to update recipe: " + data.message);
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
    alert("An error occurred while updating the recipe.");
  }
}
const recipeForm = document.getElementById("recipe-form");
recipeForm.addEventListener("submit", addRecipe);
async function addRecipe(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const ingredients = Array.from(
    document.querySelectorAll(".ingredient-input")
  ).map((input) => input.value);
  const steps = Array.from(document.querySelectorAll(".step-input")).map(
    (textarea) => textarea.value
  );

  const recipeData = {
    username,
    title: formData.get("title"), 
    is_vegan: formData.get("is_vegan") === "true", 
    picture_url: formData.get("picture_url"), 
    ingredients, 
    description: steps, 
  };
  console.log(JSON.stringify(recipeData));
  try {
    const response = await fetch("http://localhost:3000/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });
    if (response.ok) {
      alert("Recipe added successfully!");
      e.target.reset(); // Clear the form
      ingredientsList.innerHTML = ""; // Clear dynamic ingredients
      descriptionList.innerHTML = ""; // Clear dynamic steps
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
async function deleteRecipe(id) {
  try {
    const response = await fetch(`http://localhost:3000/recipes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("Recipe successfully deleted");
      location.reload();
    }
  } catch (error) {
    console.log(error);
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
