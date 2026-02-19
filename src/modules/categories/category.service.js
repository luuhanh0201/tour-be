import { createCategoryModel, findCategoryByNameModel, updateCategoryModel } from "./category.model.js"

export const createCategoryService = async (payload) => {
    const { name, description } = payload
    const { exists } = await findCategoryByNameModel({ name })
    if (exists) {
        const error = new Error("Tên này đã tồn tại, vui lòng đổi tên khác")
        error.status = 409
        error.name = "CATEGORY_NAME_ERROR"
        throw error
    }
    const newCategory = await createCategoryModel({ name, description })
    return newCategory || null
}

export const updateCategoryService = async (payload) => {
    const { id, name, description } = payload
    const { exists, category } = await findCategoryByNameModel({ name })
    if (exists && Number(id) !== category.id) {
        const error = new Error("Tên này đã tồn tại, vui lòng đổi tên khác")
        error.status = 409
        error.name = "CATEGORY_NAME_ERROR"
        throw error
    }
    const newCategory = await updateCategoryModel({ id, name, description })
    return newCategory || null

}
import { deleteCategoryModel } from "./category.model.js"

export const deleteCategoryService = async (id) => {
    const deleted = await deleteCategoryModel(id)
    return deleted
}
