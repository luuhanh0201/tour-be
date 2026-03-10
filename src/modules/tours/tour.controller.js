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
        const { errors: tourErrors, value: tourValue } = validatePayload(tourValid, payload)
        if (tourErrors) return validationErrorResponse(res, tourErrors, 400)
        // const { errors: itineraryErrors, value: itineraryValue } = validatePayload(itinerariesValid, itineraries)

        if (itineraries && Array.isArray(itineraries) && itineraries.length > 0) {
            itineraries.forEach((itinerary, index) => {
                const { errors: itineraryErrors } = validatePayload(itinerariesValid, itinerary)
                if (itineraryErrors) return validationErrorResponse(res, itineraryErrors, 400)
            })
        }
        console.log(123)

        const value = { ...tourValue, itineraries: itineraries }

        console.log("RESULT VALUE: ", value)
        const newTour = await addNewTourService(value)
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
        const { categoryName, id, createdAt, updatedAt, code, itineraries, ...tour } = await findTourByIdService({ tourId })
        const payload = req.body
        const newTour = {
            name: payload.name || tour.tour.name,
            categoryId: payload.categoryId || tour.tour.categoryId,
            durationDays: payload.durationDays || tour.tour.durationDays,
            durationNights: payload.durationNights || tour.tour.durationNights,
            description: payload.description || tour.tour.description,
            highlights: payload.highlights || tour.tour.highlights,
            basePrice: payload.basePrice || tour.tour.basePrice,
            status: payload.status || tour.tour.status,
        };
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