import { Router } from "express";
import { addNewTourController, findAllTourController, findTourByIdController, updateTourController, deleteTourController, updateItinerariesByTourIdController } from "./tour.controller.js";
const tourRoute = Router()

tourRoute.get("/", findAllTourController)
tourRoute.get("/:tourId", findTourByIdController)
tourRoute.put("/:tourId", updateTourController)
tourRoute.put("/:tourId/itinerary/:id", updateItinerariesByTourIdController)
tourRoute.post("/create", addNewTourController)
tourRoute.delete("/:id", deleteTourController)

export default tourRoute