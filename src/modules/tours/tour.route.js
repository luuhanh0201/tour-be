import { Router } from "express";
import { addNewTourController, findAllTourController, findTourByIdController, updateTourController, deleteTourController } from "./tour.controller.js";
const tourRoute = Router()

tourRoute.get("/", findAllTourController)
tourRoute.get("/:tourId", findTourByIdController)
tourRoute.put("/:tourId", updateTourController)
tourRoute.post("/create", addNewTourController)
tourRoute.delete("/:id", deleteTourController)

export default tourRoute