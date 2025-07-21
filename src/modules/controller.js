import { createProject } from "./project";
import { createTodo } from "./todo";

const ProjectController = (() => {
  let projects = [];
  let currentProjectId = null;

  const init = () => {
    if (projects.length === 0) {
      const defaultProject = createProject("Default");
      projects.push(defaultProject);
      currentProjectId = defaultProject.id;
    }
  };

  const getProjects = () => projects;

  const getCurrentProject = () =>
    projects.find((p) => p.id === currentProjectId);

  const setCurrentProject = (projectId) => {
    if (projects.find((p) => p.id === projectId)) {
      currentProjectId = projectId;
    }
  };

  const addProject = (name) => {
    const project = createProject(name);
    projects.push(project);
    return project;
  };

  const deleteProject = (projectId) => {
    projects = projects.filter((p) => p.id !== projectId);
    if (currentProjectId === projectId) {
      currentProjectId = projects[0]?.id || null;
    }
  };

  const addTodoToCurrentProject = (todoData) => {
    const todo = createTodo(todoData);
    const project = getCurrentProject();
    if (project) {
      project.addTodo(todo);
    }
    return todo;
  };

  const removeTodoFromCurrentProject = (todoId) => {
    const project = getCurrentProject();
    if (project) {
      project.removeTodo(todoId);
    }
  };

  const load = (loadedData) => {
    projects = loadedData.map((savedProject) => {
      const restoredProject = createProject(savedProject.name);
      restoredProject.id = savedProject.id;

      savedProject.todos.forEach((savedTodo) => {
        const restoredTodo = createTodo(savedTodo);
        restoredTodo.id = savedTodo.id;
        restoredTodo.completed = savedTodo.completed;
        restoredProject.addTodo(restoredTodo);
      });

      return restoredProject;
    });

    currentProjectId = projects[0]?.id || null;
  };

  return {
    init,
    getProjects,
    getCurrentProject,
    setCurrentProject,
    addProject,
    deleteProject,
    addTodoToCurrentProject,
    removeTodoFromCurrentProject,
    load,
  };
})();

export { ProjectController };
