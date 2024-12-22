const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const getTheRecipe = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/recipes/recipe/${recipeId}`
    );
    const data = await response.json();
    displayRecipe(data[0]);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

async function getCategoriesbyRecipeID (id){
  try {
    const response = await fetch (`http://localhost:3000/recipes/all/categories/${id}`)
    if(response.ok){
      const categories = await response.json()
      return categories
    }else {
      return {message : 'Error during the getCategorie'}
    }
  } catch (error) {
    console.log(error)
  }
}

function displayRecipe(recipe) {
  const recipeSection = document.getElementById("recipe");
  recipeSection.innerHTML = `
    <h1>${recipe.title}</h1>
        <img src="${recipe.picture_url}" alt="${recipe.title}">
        <ul id='categories'></ul>
        <h3>Ingredients:</h3>
        <ul id="ingredients-list"></ul>
        <h3>Instructions:</h3>
        <ol id="instructions-list"></ol>
        `;
    

  const ingredientsList = document.getElementById("ingredients-list");
  recipe.ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredientsList.appendChild(li);
  });

  const instructionsList = document.getElementById("instructions-list");
  recipe.description.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    instructionsList.appendChild(li);
  });

  const categorieUL = document.getElementById('categories')
  const categories = getCategoriesbyRecipeID(recipe.recipe_id)
    .then(categorieArr => {
      categorieArr.forEach(categorie => {
        const li = document.createElement('li')
        li.textContent = `${categorie.name}` 
        categorieUL.appendChild(li)
      })
      
    })
}

getTheRecipe();

async function loadComments(recipeId) {
  try {
    const response = await fetch(`/comments/${recipeId}`);
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = "";

      data.comments.forEach((comment) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        const formattedDate = moment(comment.created_at).format(
          "ddd, MMM D, YYYY, h:mm A"
        );
        commentElement.innerHTML = `
      <p><strong>${comment.username}</strong> says:</p>
      <p>${comment.content}</p>
      <p><em>Posted on ${formattedDate}</em></p>
    `;
        commentsList.appendChild(commentElement);
      });
    } else {
      console.error("Failed to load comments:", data.message);
    }
  } catch (err) {
    console.error("Error loading comments:", err);
  }
}

document
  .getElementById("comment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const commentContent = document
      .getElementById("comment-content")
      .value.trim();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!commentContent) {
      alert("Please write a comment.");
      return;
    }

    try {
      const response = await fetch("/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          user_id: user.user_id,
          content: commentContent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Comment added successfully!");
        document.getElementById("comment-content").value = "";
        loadComments(recipeId);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error while posting comment:", err);
      alert("Server error. Please try again.");
    }
  });

loadComments(recipeId);
