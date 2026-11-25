const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const themeToggle = document.querySelector("#themeToggle");
const dialog = document.querySelector("#projectDialog");
const projectDetails = {
  SmartStudyX:
    "An education-focused website concept for students exploring IT courses and learning resources. Add your repository and live demo links when they are ready.",
  MeroElectronics:
    "An academic electronics e-commerce project concept covering products, categories and customer/admin workflows. Add your repository and demo links when available.",
  "Frontend Experiments":
    "A collection of smaller practice projects that demonstrate responsive layouts, DOM manipulation and JavaScript fundamentals.",
};
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }),
);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
});
if (localStorage.getItem("portfolio-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}
document.querySelectorAll(".project-more").forEach((button) =>
  button.addEventListener("click", () => {
    const name = button.dataset.project;
    document.querySelector("#dialogTitle").textContent = name;
    document.querySelector("#dialogText").textContent = projectDetails[name];
    dialog.showModal();
  }),
);
document
  .querySelector("#dialogClose")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#year").textContent = new Date().getFullYear();
