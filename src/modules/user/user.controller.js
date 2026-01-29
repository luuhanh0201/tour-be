import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { adminUpdateUserService, findAllUserService, findUserByIdService, guideUpdateProfileService, updateUserAccountStatusService } from "./user.service.js"
import { profileValid, statusAccountValid, userUpdateValid } from "./user.validate.js"

export const findAllUserController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) res.status(409).json(errors)
        const users = await findAllUserService(value)
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }

}
export const findUserByIdController = async (req, res, next) => {
    try {
        const id = req.params.id
        const user = await findUserByIdService(id)
        if (!user) return res.status(409).json({ message: "Không tìm thấy user" })
        return res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}
export const adminUpdateUserController = async (req, res, next) => {
    try {
        
        const adminCurrent = req.user
        const userId = req.params.id
        const { errors, value } = validatePayload(userUpdateValid, req.body)
        if (errors) return res.status(409).json(errors)
        const payload = { ...value, userId }
        const updated = await adminUpdateUserService(adminCurrent, payload)
        return res.status(200).json({
            message: "Cập nhật thành công",
            updated
        })
    } catch (error) {
        next(error)
    }
}
export const guideUpdateProfileController = async (req, res, next) => {
    try {
        const user = req.user
        const payload = req.body
        const { errors, value } = validatePayload(profileValid, payload)
        if (errors) return res.status(400).json(errors)
        const newProfile = await guideUpdateProfileService(user, value)
        return res.status(200).json({ message: "Cập nhật thành công", newProfile })
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
        if (errors) return res.status(409).json(errors)
        const updated = await updateUserAccountStatusService(userId, value)
        return res.status(200).json({ message: "Cập nhật thành công", updated })

    } catch (error) {
        next(error)
    }
}