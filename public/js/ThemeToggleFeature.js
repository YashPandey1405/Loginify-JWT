// Method to toggle theme visibility...
document.getElementById("themeToggle").addEventListener("click", function () {
  let htmlElement = document.documentElement; // Select <html> tag
  let themeIcon = document.getElementById("themeIcon"); // Icon inside button
  let lightFooter = document.querySelector(".footer.bg-light"); // Light theme footer
  let darkFooter = document.querySelector(".footer.bg-dark"); // Dark theme footer

  if (htmlElement.getAttribute("data-bs-theme") === "dark") {
    htmlElement.setAttribute("data-bs-theme", "light");
    this.classList.replace("btn-outline-light", "btn-outline-dark"); // Change button style
    themeIcon.classList.replace("fa-sun", "fa-moon"); // Switch icon to Moon

    // Toggle footer visibility
    lightFooter.classList.remove("d-none");
    darkFooter.classList.add("d-none");
  } else {
    htmlElement.setAttribute("data-bs-theme", "dark");
    this.classList.replace("btn-outline-dark", "btn-outline-light"); // Change button style
    themeIcon.classList.replace("fa-moon", "fa-sun"); // Switch icon to Sun

    // Toggle footer visibility
    darkFooter.classList.remove("d-none");
    lightFooter.classList.add("d-none");
  }
});
