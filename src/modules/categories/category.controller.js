import { validatePayload } from "../../utils/validatePayload.until.js"
import { findCategoryByNameModel, getAllCategoryModel } from "./category.model.js"
import { createCategoryService, deleteCategoryService, updateCategoryService } from "./category.service.js"
import { categoryValid, queryValid } from "./category.validation.js"
export const getALlCategoryController = async (req, res, next) => {
    try {
        const { error } = queryValid.validate(req.body, { abortEarly: false })
        if (error) {
            const errors = error.details.reduce((acc, cur) => {
                acc[cur.path[0]] = cur.message
                return acc
            }, {})
            return res.status(400).json({ errors })
        }
        let { page = 1, limit = 10, q = "" } = req.body ?? {}
        page = Number(page)
        limit = Number(limit)
        q = typeof q === "string" ? q.trim() : ""

        if (!Number.isInteger(page) || page < 1) page = 1
        if (!Number.isInteger(limit) || limit < 1) limit = 10

        const categories = await getAllCategoryModel({ page, limit, q })
        return res.json(categories)
    } catch (error) {
        next(error)
    }
}
export const createCategoryController = async (req, res, next) => {
    try {
        const { errors } = validatePayload(categoryValid, req.body)
        if (errors) {
            return res.status(400).json(errors)
        }
        const cate = await createCategoryService(req.body)
        return res.status(200).json({
            message: "Tạo mới thành công",
            cate
        })
    } catch (error) {
        next(error)
    }
}

export const updateCategoryController = async (req, res, next) => {
    try {
        const {errors} = validatePayload(categoryValid, req.body)
        if (errors) {
            return res.status(400).json(errors)
        }
        const payload = {
            ...req.body, id: req.params.id,
        }

        const newCate = await updateCategoryService(payload)
        return res.status(200).json({
            message: "Cập nhật thành công",
            newCate
        })
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
        return res.status(200).json({
            message: "Xóa thành công"
        })
    } catch (error) {
        next(error)
    }
}
