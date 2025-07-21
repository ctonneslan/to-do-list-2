import { ProjectController } from "./controller";

const UI = (() => {
  const app = document.getElementById("app");

  const renderLayout = () => {
    app.innerHTML = `
        <div class="sidebar">
         <h2>Projects</h2>
         <ul id="project-list"></ul>
         <button id="add-project-btn">+ Add Project</button>
        </div>
        <div class="main">
         <h2 id="project-title"></h2>
         <ul id="todo-list"></ul>
         <button id="add-todo-btn">+ Add Todo</button>
        </div> 
    `;
  };

  const renderProjects = () => {
    const list = document.getElementById("project-list");
    list.innerHTML = "";

    ProjectController.getProjects().forEach((project) => {
      const li = document.createElement("li");
      li.textContent = project.name;
      li.dataset.id = project.id;

      if (project.id === ProjectController.getCurrentProject()?.id) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        ProjectController.setCurrentProject(project.id);
        renderAll();
      });

      list.appendChild(li);
    });
  };

  const renderTodos = () => {
    const title = document.getElementById("project-title");
    const list = document.getElementById("todo-list");
    const project = ProjectController.getCurrentProject();

    if (!project) {
      title.textContent = "No Project";
      list.innerHTML = "";
      return;
    }

    title.textContent = project.name;
    list.innerHTML = "";

    project.todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = `${todo.title} (Due: ${todo.dueDate})`;
      li.style.color = getPriorityColor(todo.priority);

      li.addEventListener("click", () => {
        alert(`TODO:\n\n${todo.title}\n\n${todo.description}`);
      });

      list.appendChild(li);
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "black";
    }
  };

  const bindEvents = () => {
    document.getElementById("add-project-btn").addEventListener("click", () => {
      const name = prompt("Project name?");
      if (name) {
        ProjectController.addProject(name);
        renderAll();
      }
    });

    document.getElementById("add-todo-btn").addEventListener("click", () => {
      const title = prompt("Todo title?");
      const dueDate = prompt("Due date? (YYYY-MM-DD)");
      const priority = prompt("Priority? (low, medium, high)");

      if (title) {
        ProjectController.addTodoToCurrentProject({
          title,
          dueDate,
          priority,
        });
        renderAll();
      }
    });
  };

  const renderAll = () => {
    renderLayout();
    renderProjects();
    renderTodos();
    bindEvents();
  };

  return { initApp: renderAll };
})();

export { UI };
