import { Router } from "express";
import { adminUpdateUserController, findAllUserController, findUserByIdController, guideUpdateProfileController, updateUserAccountStatusController } from "./user.controller.js";
import { requireAdmin, requiredAuth, requireGuider } from "../../middlewares/requireAuth.middleware.js";


const userRoute = Router()

// Route guide
userRoute.put("/update/me", requiredAuth, guideUpdateProfileController)



// Route admin
userRoute.use(requiredAuth, requireAdmin)
userRoute.get("/", findAllUserController)
userRoute.get("/:id", findUserByIdController)
userRoute.put("/:id", adminUpdateUserController)
userRoute.put("/:id/status", updateUserAccountStatusController)


// Guide
export default userRoute