import { Router } from "express";
import { addNewTourController, findAllTourController } from "./tour.controller.js";
const tourRoute = Router()

tourRoute.get("/", findAllTourController)
tourRoute.post("/create", addNewTourController)

export default tourRoute