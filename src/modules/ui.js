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
        <div id="modal-overlay" class="modal-overlay hidden">
            <div class="modal">
                <h2 id="modal-title">New Todo</h2>
                <form id="todo-form">
                    <label>Title <input type="text" id="todo-title" required></label>
                    <label>Description <textarea id="todo-desc"></textarea></label>
                    <label>Due Date <input type="date" id="todo-date"></label>
                    <label>Priority
                        <select id="todo-priority">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </label>
                    <div class="modal-actions">
                        <button type="submit">Save</button>
                        <button type="button" id="cancel-modal">Cancel</button>
                    </div>
                </form>
            </div>
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
        openModal(todo);
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
      openModal();
    });

    document
      .getElementById("cancel-modal")
      .addEventListener("click", closeModal);

    document.getElementById("todo-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("todo-title").value;
      const description = document.getElementById("todo-desc").value;
      const dueDate = document.getElementById("todo-date").value;
      const priority = document.getElementById("todo-priority").value;

      const project = ProjectController.getCurrentProject();
      if (!project) return;

      if (isEditing) {
        const todo = project.getTodo(editingTodoId);
        if (todo) {
          todo.update({ title, description, dueDate, priority });
        }
      } else {
        ProjectController.addTodoToCurrentProject({
          title,
          description,
          dueDate,
          priority,
        });
      }

      closeModal();
      renderAll();
    });
  };

  const renderAll = () => {
    renderLayout();
    renderProjects();
    renderTodos();
    bindEvents();
  };

  let isEditing = false;
  let editingTodoId = null;

  const openModal = (todo = null) => {
    const modal = document.getElementById("modal-overlay");
    modal.classList.remove("hidden");

    document.getElementById("modal-title").textContent = todo
      ? "Edit todo"
      : "New Todo";
    document.getElementById("todo-title").value = todo?.title || "";
    document.getElementById("todo-desc").value = todo?.description || "";
    document.getElementById("todo-date").value = todo?.dueDate || "";
    document.getElementById("todo-priority").value = todo?.priority || "low";

    isEditing = !!todo;
    editingTodoId = todo?.id || null;
  };

  const closeModal = () => {
    document.getElementById("modal-overlay").classList.add("hidden");
  };

  return { initApp: renderAll };
})();

export { UI };
