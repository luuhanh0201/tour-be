import generateRandomNumber from "../../utils/number.until.js"
import getInitials from "../../utils/string.until.js"
import { findCategoryByIdModel } from "../categories/category.model.js"
import { findAllTourModel, findTourByCodeModel, findTourByIdModel, findTourByNameModel, updateTourModel, deleteTourModel, insertTourWithItinerariesModel, updateItinerariesByIdModel } from "./tour.model.js"

export const findAllTourService = async (payload = {}) => {
    const { limit = 10, page = 1, q = "" } = payload
    const tours = await findAllTourModel({ page: page, limit: limit, q: q })
    return tours
}

export const addNewTourService = async (payload = {}) => {
    const { name, categoryId } = payload
    const { exists } = await findTourByNameModel({ tourName: name });
    if (exists) {
        const error = new Error("Tour đã tồn tại");
        error.status = 409;
        error.name = "TOUR_ERROR"
        throw error
    }

    const { category } = await findCategoryByIdModel({ id: categoryId });
    let randomCode = getInitials(category.name) + generateRandomNumber(3);
    const { exist } = await findTourByCodeModel({ code: randomCode });
    let isCode = exist
    while (isCode) {
        randomCode = getInitials(category.name) + generateRandomNumber(3);
        const res = await findTourByCodeModel({ code: randomCode });
        isCode = res.exist
    }
    const newPayload = { code: randomCode, ...payload }
    console.log(newPayload)
    const newTour = insertTourWithItinerariesModel(newPayload);
    return newTour || null

}
export const findTourByIdService = async ({ tourId }) => {
    const { exist, tour, itineraries } = await findTourByIdModel({ tourId });
    if (!exist) {
        const error = new Error("Tour không tồn tại");
        error.status = 404;
        error.name = "TOUR_NOT_FOUND"
        throw error
    }
    return { tour, itineraries };
}
export const updateTourService = async (payload = {}) => {
    const { tourId, ...updateData } = payload

    const { exist } = await findTourByIdModel({ tourId });
    if (!exist) {
        const error = new Error("Tour không tồn tại");
        error.status = 404;
        error.name = "TOUR_NOT_FOUND"
        throw error
    }
    const modelPayload = {
        id: tourId,
        name: updateData.name,
        categoryId: updateData.categoryId,
        durationDays: updateData.durationDays,
        durationNights: updateData.durationNights,
        description: updateData.description,
        highlights: updateData.highlights,
        basePrice: updateData.basePrice,
        status: updateData.status,
    }

    const result = await updateTourModel(modelPayload);
    const { tour: updatedTour } = await findTourByIdModel({ tourId });
    return { result, updatedTour };
}
export const deleteTourService = async ({ tourId } = {}) => {
    const { exist } = await findTourByIdModel({ tourId });
    if (!exist) {
        const error = new Error("Tour không tồn tại");
        error.status = 404;
        error.name = "TOUR_NOT_FOUND"
        throw error
    }
    const deleted = await deleteTourModel(tourId);
    return deleted;
}
export const updateItinerariesByIdService = async (payload = {}) => {
    const { exist } = await findTourByIdModel({ tourId: payload.tourId });
    if (!exist) {
        const error = new Error("Tour không tồn tại");
        error.status = 404;
        error.name = "TOUR_NOT_FOUND"
        throw error
    }
    const updatedItineraries = await updateItinerariesByIdModel(payload);
    return updatedItineraries;
}