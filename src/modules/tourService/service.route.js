import { Router } from "express";
import { createServiceController, deleteServiceController, getAllServiceController, updateServiceController } from "./service.controller.js";

const serviceRoute = Router()
serviceRoute.get("/", getAllServiceController)
serviceRoute.post("/create", createServiceController)
serviceRoute.put("/update/:id", updateServiceController)
serviceRoute.delete("/delete/:id", deleteServiceController)

export default serviceRoute