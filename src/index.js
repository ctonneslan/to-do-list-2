import "./style.css";
import { ProjectController } from "./modules/controller";
import { Storage } from "./modules/storage";
import { UI } from "./modules/ui";

const savedData = Storage.load();
if (savedData) {
  ProjectController.load(savedData);
} else {
  ProjectController.init();
}

UI.initApp();

window.addEventListener("beforeunload", () => {
  Storage.save(ProjectController.getProjects());
});
