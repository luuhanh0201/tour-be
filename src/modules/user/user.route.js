import { Router } from "express";
import { adminUpdateUserController, findAllUserController, findUserByIdController } from "./user.controller.js";
import { requireAdmin, requiredAuth } from "../../middlewares/requireAuth.middleware.js";


const userRoute = Router()



// Route admin
userRoute.use(requiredAuth, requireAdmin)
userRoute.get("/", findAllUserController)
userRoute.get("/:id", findUserByIdController)
userRoute.put("/update/:id", adminUpdateUserController)

export default userRoute