import { Router } from "express";
import { createTourDepartureController, getAllTourDepartureController } from "./tourDeparture.controller.js";

const tourDeparture = Router()


tourDeparture.get("/", getAllTourDepartureController)
tourDeparture.post("/create", createTourDepartureController)
export default tourDeparture