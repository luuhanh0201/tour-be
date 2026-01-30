import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { addNewTourService, findAllTourService, findTourByIdService, updateTourService, deleteTourService } from "./tour.service.js"
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
        const { itineraries, ...payload } = req.body
        const { errors, value } = validatePayload(tourValid, payload)
        console.log(errors)
        if (errors) return res.status(400).json(errors)
        const newTour = await addNewTourService(req.body)
        return res.status(200).json({
            message: "Tạo tour mới thành công",
            tour: newTour
        })

    } catch (error) {
        next(error)
    }
}
export const findTourByIdController = async (req, res, next) => {
    try {
        const { tourId } = req.params
        const tour = await findTourByIdService({ tourId })
        return res.status(200).json({
            message: "Thông tin tour",
            tour
        })
    } catch (error) {
        next(error)
    }
}
export const updateTourController = async (req, res, next) => {
    try {
        const { tourId } = req.params
        const { categoryName, id, createdAt, updatedAt, code, ...tour } = await findTourByIdService({ tourId })
        const payload = req.body
        const newTour = { ...tour, ...payload }
        const { errors, value } = validatePayload(tourValid, newTour)
        if (errors) return res.status(400).json(errors)
        const tourUpdated = await updateTourService({ tourId, ...value })
        return res.status(200).json({
            message: "Cập nhật tour thành công",
            oldTour: tour,
            tourUpdated
        })
    } catch (error) {
        next(error)
    }
}
export const deleteTourController = async (req, res, next) => {
    try {
        const { id } = req.params
        const deleted = await deleteTourService({ tourId: id })
        if (!deleted) return res.status(404).json({ message: "Tour không tồn tại hoặc đã xóa" })
        return res.status(200).json({ message: "Xóa tour thành công" })
    } catch (error) {
        next(error)
    }
}