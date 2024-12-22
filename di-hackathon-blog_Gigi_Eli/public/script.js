// Fetch request parameters
const url = "/post-data";
let options = {
    method: "GET",
    headers: {
        "content_type": "application/json"
    }
};

// Populate the home page with all the posts
async function getPosts(url, options) {
    try {
        let result = await fetch(url,options);
        let data = await result.json();
        // Append each post with correct html structure to the #blogPosts section
        data.forEach(post => {
            $("#blogPosts").append(`
        <article class="post">
            <img src="${post.cover_image ? post.cover_image : 'assets/default-cover.jpg'}" alt="Image for ${post.title}" class="post-image">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-content">${post.content}</p>
            <button class="read-more" onclick="window.location.href='post/${post.id}'">Read More</button>
        </article>
            `);
        });
        trimPostDetails()

    } catch (err){
        console.log(err);
    }
};

getPosts(url,options);

// Simple search fuctionality by hiding posts that title do not meet filter
function searchPosts() {
    const input = document.getElementById("searchInput");
    const filter = input.value.trim().toLowerCase();
    const posts = document.querySelectorAll(".post");
    const noResultsMessage = document.getElementById("noResultsMessage");
    let visiblePostCount = 0;

    posts.forEach((post) => {
        // Ensuring both the comparing and post title is in lower case
        const title = post.querySelector(".post-title").textContent.toLowerCase();
        if (title.includes(filter)) {
            post.style.display = "block";
            visiblePostCount++;
        } else {
            // Hide post if title does not include filter
            post.style.display = "none";
        }
    });

    if (visiblePostCount === 0 && filter !== "") {
        // Display the no results message if the num of visible posts is 0
        noResultsMessage.style.display = "block";
    } else {
        noResultsMessage.style.display = "none";
    }
}

// Limit content to 150 characters
function trimPostDetails(){
    document.querySelectorAll(".post-content").forEach((content) => {
        const fullText = content.textContent.trim();
        if (fullText.length > 150) {
            content.textContent = fullText.substring(0, 150) + "...";
        }
    });
}

// A post request to send submitted form data to the server
async function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("blogPostForm");
    const formData = new FormData(form);

    const payload = {
        title: formData.get("title"),
        publish_date: formData.get("publishDate"),
        author: formData.get("author"),
        cover_image: formData.get("coverImage"),
        content: formData.get("content")
    };

    try {
        const response = await fetch("/submit-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert("Blog post submitted successfully!");
            form.reset();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error submitting post:", error);
        alert("An error occurred while submitting the post.");
    }
}
