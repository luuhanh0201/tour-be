import { findUserByIdModel, findUsernameModel } from "../auth/auth.model.js"
import { adminUpdateUserModel, findAllUserModel, getUserWithProfileByIdModel, guideUpdateProfileModel, updateUserAccountStatusModel } from "./user.model.js"

export const findAllUserService = async (payload = {}) => {
    const { q = "", limit = 10, page = 1 } = payload
    const users = await findAllUserModel({ page: page, limit: limit, q: q })
    if (!users) {
        const error = new Error("Lỗi tìm kiếm")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    return users
}
export const findUserByIdService = async (id) => {
    const { user, exist } = await findUserByIdModel(id)
    if (exist) {
        const error = new Error("User không tồn tại")
        error.name = "USER_ERROR"
        error.status = 409
    }
    return user
}
export const adminUpdateUserService = async (admin, payload) => {
    const { role, username, userId } = payload
    if (admin?.role !== "admin") {
        const error = new Error("Bạn không thể thực hiện hành động này.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    if (!userId) {
        const error = new Error("UserId không tồn tại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    if (role === "admin") {
        console.log("Xác nhận mật khẩu để tiếp tục")
    }
    const { exists, user } = await findUsernameModel({ username })
    if (exists && user.id !== Number(userId)) {
        const error = new Error("Người dùng này đã tồn tại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    const updated = await adminUpdateUserModel(payload)
    if (!updated) {
        const error = new Error("Cập nhật thất bại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    const { userProfile } = await getUserWithProfileByIdModel(userId)
    return userProfile
}
export const guideUpdateProfileService = async (user, payload) => {
    if (!user) {
        const error = new Error("Người dùng không tồn tại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    const { id } = user
    const profileUpdated = await guideUpdateProfileModel({ ...payload, userId: id })
    if (!profileUpdated) {
        const error = new Error("Cập nhật thất bại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    const newUser = await getUserWithProfileByIdModel(id)
    return newUser
}

export const updateUserAccountStatusService = async (userId, payload = {}) => {
    const { isBlock, employmentStatus, workingStatus } = payload
    if (!userId) {
        const error = new Error("Người dùng không tồn tại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    const updated = await updateUserAccountStatusModel({ id: userId, isBlock, employmentStatus, workingStatus })
    if (!updated) {
        const error = new Error("Cập nhật thất bại.")
        error.name = "USER_ERROR"
        error.status = 409
        throw error
    }
    const newUser = await getUserWithProfileByIdModel(userId)
    return newUser

}