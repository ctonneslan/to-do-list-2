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
      li.dataset.id = project.id;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = project.name;
      nameSpan.classList.add("project-name");
      if (project.id === ProjectController.getCurrentProject()?.id) {
        nameSpan.classList.add("active");
      }

      nameSpan.addEventListener("click", () => {
        ProjectController.setCurrentProject(project.id);
        renderAll();
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.title = "Delete project";
      delBtn.addEventListener("click", () => {
        ProjectController.deleteProject(project.id);
        renderAll();
      });

      li.appendChild(nameSpan);
      li.appendChild(delBtn);
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
      li.classList.add("todo-item");
      li.style.color = getPriorityColor(todo.priority);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.toggleComplete();
        renderAll();
      });

      const text = document.createElement("span");
      text.textContent = `${todo.title} (Due: ${todo.dueDate})`;
      if (todo.completed) {
        text.style.textDecoration = "line-through";
      }

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.title = "Edit todo";
      editBtn.addEventListener("click", () => {
        const newTitle = prompt("Edit title:", todo.title);
        const newDesc = prompt("Edit description:", todo.description);
        const newDue = prompt("Edit due date (YYYY-MM-DD):", todo.dueDate);
        const newPriority = prompt(
          "Edit priority (low, medium, high):",
          todo.priority
        );

        if (newTitle) {
          todo.update({
            title: newTitle,
            description: newDesc,
            dueDate: newDue,
            priority: newPriority,
          });
          renderAll();
        }
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.title = "Delete todo";
      delBtn.addEventListener("click", () => {
        ProjectController.removeTodoFromCurrentProject(todo.id);
        renderAll();
      });

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
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
