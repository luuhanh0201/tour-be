import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { adminUpdateUserService, findAllUserService, findUserByIdService, guideUpdateProfileService, updateUserAccountStatusService } from "./user.service.js"
import { profileValid, statusAccountValid, userUpdateValid } from "./user.validate.js"
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js"

export const findAllUserController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) res.status(409).json(errors)
        const users = await findAllUserService(value)
        return successResponse(res, "Danh sách người dùng", users, 200)
    } catch (error) {
        next(error)
    }

}
export const findUserByIdController = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await findUserByIdService(id)
        if (!user) return errorResponse(res, "Không tìm thấy user", null, 409)
        return successResponse(res, "Thông tin người dùng", user, 200)
    } catch (error) {
        next(error)
    }
}
export const adminUpdateUserController = async (req, res, next) => {
    try {
        
        const adminCurrent = req.user
        const userId = req.params.id
        const { errors, value } = validatePayload(userUpdateValid, req.body)
        if (errors) return validationErrorResponse(res, errors, 409)
        const payload = { ...value, userId }
        const updated = await adminUpdateUserService(adminCurrent, payload)
        return successResponse(res, "Cập nhật thành công", updated, 200)
    } catch (error) {
        next(error)
    }
}
export const guideUpdateProfileController = async (req, res, next) => {
    try {
        const user = req.user
        const payload = req.body
        const { errors, value } = validatePayload(profileValid, payload)
        if (errors) return validationErrorResponse(res, errors, 400)
        const newProfile = await guideUpdateProfileService(user, value)
        return successResponse(res, "Cập nhật thành công", newProfile, 200)
    } catch (error) {
        next(error)
    }
}
export const updateUserAccountStatusController = async (req, res, next) => {
    try {
        const role = req?.user?.role
        if (role !== "admin" && role !== "guide") {
            const error = new Error("Bạn không có quyền làm việc này.")
            error.name = "USER_ERROR"
            error.status = 409
            throw error
        }
        const userId = req.params.id
        const payload = req.body
        const { errors, value } = validatePayload(statusAccountValid, payload)
        if (errors) return validationErrorResponse(res, errors, 409)
        const updated = await updateUserAccountStatusService(userId, value)
        return successResponse(res, "Cập nhật thành công", updated, 200)

    } catch (error) {
        next(error)
    }
}