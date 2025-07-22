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

                    <div id="checklist-container">
                        <label>Checklist</label>
                        <ul id="checklist-items"></ul>
                        <div class="checklist-add">
                            <input type="text" id="checklist-input" placeholder="Add checklist item...">
                            <button type="button" id="add-checklist-btn">+</button>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="submit">Save</button>
                        <button type="button" id="cancel-modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="project-modal-overlay" class="modal-overlay hidden">
            <div class="modal">
                <h2 id="project-modal-title">New Project</h2>
                <form id="project-form">
                    <label>Project Name <input type="text" id="project-name-input" required></label>
                    <div class="modal-actions">
                        <button type="submit">Save</button>
                        <button type="button" id="cancel-project-modal">Cancel</button>
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

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.title = "Edit project";
      editBtn.addEventListener("click", () => {
        openProjectModal(project);
      });

      li.appendChild(nameSpan);
      li.appendChild(editBtn);
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

      const header = document.createElement("div");
      header.classList.add("todo-header");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.toggleComplete();
        renderAll();
      });

      const titleSpan = document.createElement("span");
      titleSpan.textContent = `${todo.title} (Due: ${todo.dueDate})`;
      if (todo.completed) {
        titleSpan.style.textDecoration = "line-through";
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

      const expandBtn = document.createElement("button");
      expandBtn.textContent = "▼";
      expandBtn.title = "Expand details";
      expandBtn.addEventListener("click", () => {
        details.classList.toggle("hidden");
        expandBtn.textContent = details.classList.contains("hidden")
          ? "▼"
          : "▲";
      });

      header.append(checkbox, titleSpan, expandBtn, editBtn, delBtn);
      li.appendChild(header);

      const details = document.createElement("div");
      details.classList.add("todo-details", "hidden");
      details.innerHTML = `
        <p><strong>Description:</strong> ${todo.description || "None"}</p>
        <p><strong>Notes:</strong> ${todo.notes || "None"}</p>
        ${
          todo.checklist?.length
            ? `<ul><strong>Checklist:</strong> ${todo.checklist
                .map(
                  (item) => `<li>${item.checked ? "✅" : "⬜"} 
                    ${item.item}</li>`
                )
                .join("")}</ul>`
            : ""
        }
      `;

      li.appendChild(details);
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
      openProjectModal();
    });

    document
      .getElementById("cancel-project-modal")
      .addEventListener("click", closeProjectModal);

    document.getElementById("project-form").addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("project-name-input").value;
      if (!name) return;

      if (isProjectEditing) {
        const project = ProjectController.getProjects().find(
          (p) => p.id === editingProjectId
        );
        if (project) {
          project.name = name;
        } else {
          ProjectController.addProject(name);
        }
      }

      closeProjectModal();
      renderAll();
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
          todo.update({
            title,
            description,
            dueDate,
            priority,
            checklist: currentChecklist,
          });
        }
      } else {
        ProjectController.addTodoToCurrentProject({
          title,
          description,
          dueDate,
          priority,
          checklist: currentChecklist,
        });
      }

      closeModal();
      renderAll();
    });

    document
      .getElementById("add-checklist-btn")
      .addEventListener("click", () => {
        const input = document.getElementById("checklist-input");
        const text = input.value.trim();
        if (!text) {
          return;
        }

        currentChecklist.push({ item: text, checked: false });
        input.value = "";
        renderChecklist();
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

    currentChecklist = todo?.checklist ? [...todo.checklist] : [];
    renderChecklist();
  };

  const closeModal = () => {
    document.getElementById("modal-overlay").classList.add("hidden");
  };

  let isProjectEditing = false;
  let editingProjectId = null;

  const openProjectModal = (project = null) => {
    const overlay = document.getElementById("project-modal-overlay");
    overlay.classList.remove("hidden");

    document.getElementById("project-modal-title").textContent = project
      ? "Edit Project"
      : "New Project";
    document.getElementById("project-name-input").value = project?.name || "";

    isProjectEditing = !!project;
    editingProjectId = project?.id || null;
  };

  const closeProjectModal = () => {
    document.getElementById("project-modal-overlay").classList.add("hidden");
  };

  let currentChecklist = [];

  const renderChecklist = () => {
    const list = document.getElementById("checklist-items");
    list.innerHTML = "";

    currentChecklist.forEach((item, index) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked;
      checkbox.addEventListener("change", () => {
        item.checked = checkbox.checked;
      });

      const span = document.createElement("span");
      span.textContent = item.item;

      label.append(checkbox, span);

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", () => {
        currentChecklist.splice(index, 1);
        renderChecklist();
      });

      li.append(label, delBtn);
      list.appendChild(li);
    });
  };

  return { initApp: renderAll };
})();

export { UI };
