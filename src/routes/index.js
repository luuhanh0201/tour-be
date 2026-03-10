import { Router } from "express";
import authRoute from "../modules/auth/auth.route.js";
import categoryRoute from "../modules/categories/category.route.js";
import userRoute from "../modules/user/user.route.js";
import tourRoute from "../modules/tours/tour.route.js";
import serviceRoute from "../modules/tourService/service.route.js";
import customerRoute from "../modules/customers/customer.route.js";
import tourDeparture from "../modules/tourDepartures/tourDepartures.route.js";
import { requiredAuth } from "../middlewares/requireAuth.middleware.js";
const router = Router()

router.use("/auth", authRoute)
// router.use(requiredAuth)
router.use("/category", categoryRoute)
router.use("/service", serviceRoute)
router.use("/tour", tourRoute)
router.use("/customer", customerRoute)
router.use("/departure", tourDeparture)


router.use("/user", userRoute)
router.use("/health", (req, res) => {
    return res.status(200).json({
        message: "Connect OKE"
    })
})
export default router