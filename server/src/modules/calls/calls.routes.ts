import { Router } from "express";
import { CallsController } from "./calls.controller";
import { isAuthenticated } from "src/middlewares/isAuthenticated";

const callsRoutes = Router();
const callsController = new CallsController();

callsRoutes.get('/', isAuthenticated, callsController.list);
callsRoutes.post('/', isAuthenticated, callsController.create);
callsRoutes.get('/:id', isAuthenticated, callsController.listById);
callsRoutes.put('/:id', isAuthenticated, callsController.editCall);
callsRoutes.delete('/:id', isAuthenticated, callsController.deleteCall);

export { callsRoutes }

