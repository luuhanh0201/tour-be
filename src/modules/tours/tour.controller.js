import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { findItinerariesByIdModel } from "./tour.model.js"
import { addNewTourService, findAllTourService, findTourByIdService, updateTourService, deleteTourService, updateItinerariesByIdService } from "./tour.service.js"
import { itinerariesValid, tourValid } from "./tour.validation.js"
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js"

export const findAllTourController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) return validationErrorResponse(res, errors, 409)
        const tours = await findAllTourService(value)

        return successResponse(res, "Danh sách tour", tours, 200)
    } catch (error) {
        next(error)
    }
}

export const addNewTourController = async (req, res, next) => {
    try {
        const { itineraries, ...payload } = req.body
        const { errors, value } = validatePayload(tourValid, payload)
        if (errors) return validationErrorResponse(res, errors, 400)
        const newTour = await addNewTourService(req.body)
        return successResponse(res, "Tạo tour mới thành công", newTour, 200)

    } catch (error) {
        next(error)
    }
}
export const findTourByIdController = async (req, res, next) => {
    try {
        const { tourId } = req.params
        const tour = await findTourByIdService({ tourId })
        return successResponse(res, "Thông tin tour", tour, 200)
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
        if (errors) return validationErrorResponse(res, errors, 400)
        const tourUpdated = await updateTourService({ tourId, ...value })
        return successResponse(res, "Cập nhật tour thành công", { oldTour: tour, tourUpdated }, 200)
    } catch (error) {
        next(error)
    }
}
export const deleteTourController = async (req, res, next) => {
    try {
        const { id } = req.params
        const deleted = await deleteTourService({ tourId: id })
        if (!deleted) return errorResponse(res, "Tour không tồn tại hoặc đã xóa", null, 404)
        return successResponse(res, "Xóa tour thành công", null, 200)
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
        if (errors) return validationErrorResponse(res, errors, 400)
        console.log(value)
        const updatedItineraries = await updateItinerariesByIdService({ ...value, id, tourId })
        return successResponse(res, "Cập nhật lịch trình thành công", updatedItineraries, 200)
    } catch (error) {
        next(error)
    }
}