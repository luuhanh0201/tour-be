import { validatePayload } from "../../utils/validatePayload.until.js"
import { findCategoryByNameModel, getAllCategoryModel } from "./category.model.js"
import { createCategoryService, deleteCategoryService, updateCategoryService } from "./category.service.js"
import { categoryValid, queryValid } from "./category.validation.js"
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js"
export const getALlCategoryController = async (req, res, next) => {
    try {
        console.log("CONTROLLER req.query:", req.query);

        const { error } = queryValid.validate(req.query, { abortEarly: false })
        if (error) {
            const errors = error.details.reduce((acc, cur) => {
                acc[cur.path[0]] = cur.message
                return acc
            }, {})
            return validationErrorResponse(res, errors, 400)
        }
        let { page = 1, limit = 10, q = "" } = req.query ?? {}
        page = Number(page)
        limit = Number(limit)
        q = typeof q === "string" ? q.trim() : ""

        if (!Number.isInteger(page) || page < 1) page = 1
        if (!Number.isInteger(limit) || limit < 1) limit = 10

        const categories = await getAllCategoryModel({ page, limit, q })
        return successResponse(res, "Danh sách danh mục", categories, 200)
    } catch (error) {
        next(error)
    }
}
export const createCategoryController = async (req, res, next) => {
    try {   
        const { errors } = validatePayload(categoryValid, req.body)
        if (errors) {
            return validationErrorResponse(res, errors, 400)
        }
        const cate = await createCategoryService(req.body)
        return successResponse(res, "Tạo mới thành công", cate, 200)
    } catch (error) {
        next(error)
    }
}

export const updateCategoryController = async (req, res, next) => {
    try {
        const {errors} = validatePayload(categoryValid, req.body)
        if (errors) {
            return validationErrorResponse(res, errors, 400)
        }
        const payload = {
            ...req.body, id: req.params.id,
        }

        const newCate = await updateCategoryService(payload)
        return successResponse(res, "Cập nhật thành công", newCate, 200)
    } catch (error) {
        next(error)
    }
}

export const deleteCategoryController = async (req, res, next) => {
    try {
        const { id } = req.params
        const deleted = await deleteCategoryService(id)
        if (!deleted) {
            const err = new Error("Category không tồn tại")
            err.status = 404
            err.name = "CATEGORY_NOT_FOUND"
            throw err
        }
        return successResponse(res, "Xóa thành công", null, 200)
    } catch (error) {
        next(error)
    }
}
