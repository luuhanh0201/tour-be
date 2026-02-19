import { validatePayload } from "../../utils/validatePayload.until.js";
import { queryValid } from "../categories/category.validation.js";
import { changeStatusTourDepartureModel } from "./tourDepartures.model.js";
import { changeStatusTourDepartureService, createTourDepartureService, getAllTourDepartureService } from "./tourDepartures.service.js"
import { departureValid } from "./tourDepartures.validate.js";
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js";

export const createTourDepartureController = async (req, res, next) => {
    try {
        const payload = req.body;
        const { errors, value } = validatePayload(departureValid, payload)
        if (errors) return validationErrorResponse(res, errors, 400)
        const created = await createTourDepartureService(value)
        return successResponse(res, "Tạo lịch khởi hành thành công", created, 200)
    } catch (error) {
        next(error)
    }
}
export const getAllTourDepartureController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) return validationErrorResponse(res, errors, 409)
        const tours = await getAllTourDepartureService(value)

        return successResponse(res, "Danh sách lịch khởi hành tour", tours, 200)
    } catch (error) {
        next(error)
    }
}
export const changeStatusTourDepartureController = async (req, res, next) => {
    try {
        const { status } = req.body
        const id = req.params.id
        const updated = await changeStatusTourDepartureService(id, status)
        const message = updated.changedRows !== 0 ? "Cập nhật trạng thái thành công" : "Dữ liệu không thay đổi"
        return successResponse(res, message, updated, 200)
    } catch (error) {
        next(error)
    }
}