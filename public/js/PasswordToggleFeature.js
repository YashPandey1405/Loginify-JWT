const toggle = document.getElementById("togglePassword");
const passwordInput = document.getElementById("Password");

// Event listener for the password toggle button.....
toggle.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  // Optional: change the eye icon
  toggle.textContent = type === "password" ? "👁️" : "🙈";
});