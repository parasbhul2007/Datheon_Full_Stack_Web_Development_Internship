const STORAGE_KEY = "focusboard-tasks-v1";
let tasks = loadTasks();
let currentFilter = "All";
let editingId = null;
const $ = (selector) => document.querySelector(selector);
const taskList = $("#taskList");
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function safeText(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
function render() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const filtered = tasks.filter(
    (task) =>
      (currentFilter === "All" ||
        (currentFilter === "Active" && !task.completed) ||
        (currentFilter === "Completed" && task.completed)) &&
      (task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)),
  );
  taskList.innerHTML = filtered.length
    ? filtered
        .map(
          (
            task,
          ) => `<article class="task-item ${task.completed ? "done" : ""}" data-id="${task.id}">
    <input class="task-check" type="checkbox" aria-label="Mark ${safeText(task.title)} complete" ${task.completed ? "checked" : ""} data-action="toggle">
    <div class="task-main"><div class="task-title">${safeText(task.title)}</div><div class="task-meta"><span class="category ${safeText(task.category)}">${safeText(task.category)}</span><span>${task.dueDate ? `Due ${safeText(task.dueDate)}` : "No due date"}</span></div></div>
    <div class="task-actions"><button class="icon-button" data-action="edit" aria-label="Edit task">Edit</button><button class="icon-button" data-action="delete" aria-label="Delete task">Delete</button></div></article>`,
        )
        .join("")
    : `<div class="empty"><strong>${query ? "No matching tasks" : "Nothing here yet"}</strong>${query ? "Try another search term." : "Add a task above and it will appear here."}</div>`;
  $("#totalCount").textContent = tasks.length;
  $("#allCount").textContent = tasks.length;
  $("#activeCount").textContent = tasks.filter((t) => !t.completed).length;
  $("#completedCount").textContent = tasks.filter((t) => t.completed).length;
}
$("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = $("#taskTitle").value.trim();
  if (!title) return;
  tasks.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    category: $("#taskCategory").value,
    dueDate: $("#taskDue").value,
    completed: false,
    createdAt: new Date().toISOString(),
  });
  saveTasks();
  render();
  event.target.reset();
  $("#formMessage").textContent = "Task added and saved.";
  $("#taskTitle").focus();
});
document.querySelectorAll(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document
      .querySelectorAll(".filter")
      .forEach((b) => b.classList.toggle("active", b === button));
    render();
  }),
);
$("#searchInput").addEventListener("input", render);
taskList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const article = button.closest("[data-id]");
  const task = tasks.find((item) => item.id === article.dataset.id);
  if (!task) return;
  if (button.dataset.action === "delete") {
    if (confirm("Delete this task?")) {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      render();
    }
  }
  if (button.dataset.action === "edit") {
    editingId = task.id;
    $("#editTitle").value = task.title;
    $("#editCategory").value = task.category;
    $("#editDue").value = task.dueDate || "";
    $("#editDialog").showModal();
  }
});
taskList.addEventListener("change", (event) => {
  if (event.target.dataset.action !== "toggle") return;
  const id = event.target.closest("[data-id]").dataset.id;
  const task = tasks.find((item) => item.id === id);
  if (task) {
    task.completed = event.target.checked;
    saveTasks();
    render();
  }
});
$("#editForm").addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const task = tasks.find((item) => item.id === editingId);
  if (!task) return;
  task.title = $("#editTitle").value.trim();
  task.category = $("#editCategory").value;
  task.dueDate = $("#editDue").value;
  saveTasks();
  $("#editDialog").close();
  render();
});
$("#clearCompleted").addEventListener("click", () => {
  const count = tasks.filter((task) => task.completed).length;
  if (!count) return;
  if (confirm(`Remove ${count} completed task(s)?`)) {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
  }
});
$("#todayLabel").textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "long",
  day: "numeric",
}).format(new Date());
render();
