import generateRandomNumber from "../../utils/number.until.js"
import getInitials from "../../utils/string.until.js"
import { findCategoryByIdModel } from "../categories/category.model.js"
import { addNewTourModel, findAllTourModel, findTourByCodeModel, findTourByNameModel } from "./tour.model.js"

export const findAllTourService = async (payload = {}) => {
    const { limit = 10, page = 1, q = "" } = payload
    const tours = await findAllTourModel({ page: page, limit: limit, q: q })
    return tours
}
export const addNewTourService = async (payload = {}) => {
    const { name, categoryId } = payload
    const { exists } = await findTourByNameModel({ name });
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
    const newPayload = { ...payload, code: randomCode }
    const newTour = await addNewTourModel(newPayload);
    return newTour || null

}