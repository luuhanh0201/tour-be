import { createUserModel, findUsernameModel } from "./auth.model.js"
import bcrypt from "bcryptjs"
export const signUpService = async (payload) => {
    const { username, email, fullName } = payload
    const { exists } = await findUsernameModel({ username, email })
    if (exists) {
        const error = new Error("Username hoặc email đã tồn tại")
        error.name = "ACCOUNT_EXISTS"
        error.status = 409
        throw error
    }
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const user = await createUserModel({
        username: username,
        fullName: fullName,
        email: email,
        password: hashPassword,
    })
    return user
}
export const signInService = async (payload) => {
    const { username, password } = payload
    const { exists, user } = await findUsernameModel({ username })
    if (!exists) {
        const error = new Error("Username không tồn tại.")
        error.status = 404;
        error.name = "ACCOUNT_NOT_FOUND"
        throw error
    }
    const isPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isPassword) {
        const error = new Error("Sai mật khẩu.")
        error.name = "ERROR_PASSWORD"
        error.status = 401;
        throw error
    }
    if (user.isBlock) {
        const error = new Error("Tài khoản đã bị khoá, vui lòng liên hệ với admin để biết thêm thông tin.")
        error.name = "ACCOUNT_ERROR"
        error.status = 400;
        throw error
    }
    const { password_hash: _pw, ...safeUser } = user
    return safeUser
}