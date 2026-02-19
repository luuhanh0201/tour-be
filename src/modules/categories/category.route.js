import { Router } from "express";
import { createCategoryController, deleteCategoryController, getALlCategoryController, updateCategoryController } from "./category.controller.js";
import { requireAdmin, requiredAuth } from "../../middlewares/requireAuth.middleware.js";

const categoryRoute = Router()
categoryRoute.get("/", getALlCategoryController)
categoryRoute.post("/create", createCategoryController)
categoryRoute.put("/update/:id", updateCategoryController)
categoryRoute.delete("/delete/:id", deleteCategoryController)

export default categoryRoute