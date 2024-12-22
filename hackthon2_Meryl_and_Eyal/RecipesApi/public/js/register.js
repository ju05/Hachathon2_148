async function registerUser(event) {
  event.preventDefault();

  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        username,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      document.getElementById("error-message").innerText = error;
    } else {
      window.location.href = "/login.html";
    }
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    document.getElementById("error-message").innerText = "Erreur serveur.";
  }
}
