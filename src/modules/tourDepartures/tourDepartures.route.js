import { Router } from "express";
import { changeStatusTourDepartureController, createTourDepartureController, getAllTourDepartureController } from "./tourDeparture.controller.js";

const tourDeparture = Router()


tourDeparture.get("/", getAllTourDepartureController)
tourDeparture.put("/:id", changeStatusTourDepartureController)
tourDeparture.post("/create", createTourDepartureController)
export default tourDeparture