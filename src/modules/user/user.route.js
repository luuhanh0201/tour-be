import { Router } from "express";
import { adminUpdateUserController, findAllUserController, findUserByIdController, guideUpdateProfileController } from "./user.controller.js";
import { requireAdmin, requiredAuth, requireGuider } from "../../middlewares/requireAuth.middleware.js";


const userRoute = Router()

userRoute.put("/update/me", requiredAuth, guideUpdateProfileController)



// Route admin
userRoute.use(requiredAuth, requireAdmin)
userRoute.get("/", findAllUserController)
userRoute.get("/:id", findUserByIdController)
userRoute.put("/update/:id", adminUpdateUserController)


// Guide
export default userRoute