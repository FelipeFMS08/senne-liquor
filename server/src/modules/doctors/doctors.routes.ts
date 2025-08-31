
import { Router } from "express";
import { DoctorsController } from "./doctors.controller";
import { isAuthenticated } from "src/middlewares/isAuthenticated";

const doctorsRoutes = Router();
const doctorsController = new DoctorsController();

doctorsRoutes.post("/", isAuthenticated, doctorsController.create);
doctorsRoutes.get("/", isAuthenticated, doctorsController.list);
doctorsRoutes.get("/:id", isAuthenticated, doctorsController.listById);
doctorsRoutes.get("/calls/:id", isAuthenticated, doctorsController.listCallsByDoctor);
doctorsRoutes.put("/:id", isAuthenticated, doctorsController.editDoctor);
doctorsRoutes.delete("/:id", isAuthenticated, doctorsController.deleteDoctor);

export { doctorsRoutes };
