
import { Router } from "express";
import { HospitalsController } from "./hospitals.controller.js";
import { isAuthenticated } from "src/middlewares/isAuthenticated.js";

const hospitalsRoutes = Router();
const hospitalsController = new HospitalsController();

hospitalsRoutes.post("/", isAuthenticated, hospitalsController.create);
hospitalsRoutes.get("/", isAuthenticated, hospitalsController.list);
hospitalsRoutes.get("/:id", isAuthenticated, hospitalsController.listById);
hospitalsRoutes.get("/calls/:id", isAuthenticated, hospitalsController.listCallsByHospital);
hospitalsRoutes.put("/:id", isAuthenticated, hospitalsController.editHospital);
hospitalsRoutes.delete("/:id", isAuthenticated, hospitalsController.deleteHospital);

export { hospitalsRoutes };
