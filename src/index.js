import "./style.css";
import { ProjectController } from "./modules/controller";
import { Storage } from "./modules/storage";

const savedData = Storage.load();
if (savedData) {
  ProjectController.load(savedData);
} else {
  ProjectController.init();
}

window.addEventListener("beforeunload", () => {
  Storage.save(ProjectController.getProjects());
});
