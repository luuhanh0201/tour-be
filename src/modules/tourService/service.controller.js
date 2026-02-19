import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { createServiceService, deleteServiceService, findAllServiceService, updateServiceService } from "./service.service.js"
import { serviceValid } from "./service.validation.js"
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js"

export const getAllServiceController = async (req, res, next) => {
    try {
        const { errors } = validatePayload(queryValid, req.body)
        if (errors) return validationErrorResponse(res, errors, 400)
        const tourServices = await findAllServiceService(req.body)
        return successResponse(res, "Danh sách dịch vụ", tourServices, 200)
    } catch (error) {
        next()
    }
}
export const createServiceController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(serviceValid, req.body)
        if (errors) return validationErrorResponse(res, errors, 409)
        const result = await createServiceService(value);
        return successResponse(res, "Tạo dịch vụ thành công", result, 201);
    } catch (error) {
        next(error)
    }
}
export const updateServiceController = async (req, res, next) => {
    try {
        const id = req.params.id
        const { errors, value } = validatePayload(serviceValid, req.body)
        const payload = { id, ...value }
        if (errors) return validationErrorResponse(res, errors, 409)
        const updated = await updateServiceService(payload)
        return successResponse(res, "Cập nhật dịch vụ thành công", updated, 200)
    } catch (error) {
        next(error)
    }
}
export const deleteServiceController = async (req, res, next) => {
    try {
        const id = req.params.id
        const deleted = await deleteServiceService(id)
        return successResponse(res, "Xóa dịch vụ thành công", deleted, 200)
    } catch (error) {
        next(error)
    }
}