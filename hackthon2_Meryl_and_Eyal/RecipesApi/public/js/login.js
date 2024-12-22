async function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      document.getElementById("error-message").innerText = error.message;
    } else {
      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

      window.location.href = "/homepage.html";
    }
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    document.getElementById("error-message").innerText = "Server Error.";
  }
}
