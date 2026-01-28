import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { addNewTourService, findAllTourService } from "./tour.service.js"
import { tourValid } from "./tour.validation.js"

export const findAllTourController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) return res.status(409).json(errors)
        const tours = await findAllTourService(value)

        return res.status(200).json({ message: "Danh sách tour", tours })
    } catch (error) {
        next(error)
    }
}

export const addNewTourController = async (req, res, next) => {
    try {
        const payload = req.body
        const { errors, value } = validatePayload(tourValid, payload)
        // const numberCode = generateRandomNumber(6)
        if (errors) return res.status(400).json(errors)
        const newTour = await addNewTourService(value)
        return res.status(200).json({
            message: "Tạo tour mới thành công",
            tour: newTour
        })

    } catch (error) {
        next(error)
    }
}