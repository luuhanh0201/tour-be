import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { findItinerariesByIdModel } from "./tour.model.js"
import { addNewTourService, findAllTourService, findTourByIdService, updateTourService, deleteTourService, updateItinerariesByIdService } from "./tour.service.js"
import { itinerariesValid, tourValid } from "./tour.validation.js"

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
export const updateItinerariesByTourIdController = async (req, res, next) => {
    try {
        const { tourId, id } = req.params
        const payload = req.body
        const { itinerary } = await findItinerariesByIdModel({ id })
        const valueItinerary = { ...itinerary, ...payload }
        const { errors, value } = validatePayload(itinerariesValid, valueItinerary)
        if (errors) return res.status(400).json(errors)
        console.log(value)
        const updatedItineraries = await updateItinerariesByIdService({ ...value, id, tourId })
        return res.status(200).json({
            message: "Cập nhật lịch trình thành công",
            updatedItineraries
        })
    } catch (error) {
        next(error)
    }
}