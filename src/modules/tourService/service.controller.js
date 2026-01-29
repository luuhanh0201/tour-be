import { validatePayload } from "../../utils/validatePayload.until.js"
import { queryValid } from "../categories/category.validation.js"
import { createServiceService, deleteServiceService, findAllServiceService, updateServiceService } from "./service.service.js"
import { serviceValid } from "./service.validation.js"

export const getAllServiceController = async (req, res, next) => {
    try {
        const { errors } = validatePayload(queryValid, req.body)
        if (errors) return res.status(400).json(errors)
        const tourServices = await findAllServiceService(req.body)
        return res.status(200).json(tourServices)
    } catch (error) {
        next()
    }
}
export const createServiceController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(serviceValid, req.body)
        if (errors) return res.status(409).json(errors)
        const result = await createServiceService(value);
        return res.status(201).json({ data: result });
    } catch (error) {
        next(error)
    }
}
export const updateServiceController = async (req, res, next) => {
    try {
        const id = req.params.id
        const { errors, value } = validatePayload(serviceValid, req.body)
        const payload = { id, ...value }
        if (errors) return res.status(409).json(errors)
        const updated = await updateServiceService(payload)
        return res.status(200).json(updated)
    } catch (error) {
        next(error)
    }
}
export const deleteServiceController = async (req, res, next) => {
    try {
        const id = req.params.id
        const deleted = await deleteServiceService(id)
        return res.status(200).json(deleted)
    } catch (error) {
        next(error)
    }
}