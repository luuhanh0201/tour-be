import { validatePayload } from "../../utils/validatePayload.until.js";
import { queryValid } from "../categories/category.validation.js";
import { createTourDepartureService, getAllTourDepartureService } from "./tourDepartures.service.js"
import { departureValid } from "./tourDepartures.validate.js";

export const createTourDepartureController = async (req, res, next) => {
    try {
        const payload = req.body;
        const { errors, value } = validatePayload(departureValid, payload)
        if (errors) return res.status(400).json(errors)
        const created = await createTourDepartureService(value)
        return res.status(200).json({
            message: "Tạo lịch khởi hành thành công",
            data: created
        })
    } catch (error) {
        next(error)
    }
}
export const getAllTourDepartureController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) return res.status(409).json(errors)
        const tours = await getAllTourDepartureService(value)

        return res.status(200).json({ message: "Danh sách lịch khởi hành tour", tours })
    } catch (error) {
        next(error)
    }
}