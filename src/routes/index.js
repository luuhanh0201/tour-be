import { Router } from "express";
import authRoute from "../modules/auth/auth.route.js";
import categoryRoute from "../modules/categories/category.route.js";
import userRoute from "../modules/user/user.route.js";
const router = Router()

router.use("/auth", authRoute)
router.use("/category", categoryRoute)
router.use("/user", userRoute)
router.use("/health", ((req, res) => {
    return res.status(200).json({
        message: "Connect OKE"
    })
}))
export default router