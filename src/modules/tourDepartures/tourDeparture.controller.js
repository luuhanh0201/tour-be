import { validatePayload } from "../../utils/validatePayload.until.js";
import { queryValid } from "../categories/category.validation.js";
import { changeStatusTourDepartureModel } from "./tourDepartures.model.js";
import { changeStatusTourDepartureService, createTourDepartureService, getAllTourDepartureService } from "./tourDepartures.service.js"
import { departureValid } from "./tourDepartures.validate.js";

export const createTourDepartureController = async (req, res, next) => {
    try {
        const payload = req.body;
        const { errors, value } = validatePayload(departureValid, payload)
        if (errors) return res.status(400).json(errors)
        const created = await createTourDepartureService(value)
        return res.status(200).json({
            message: "Tạo lịch khởi hành thành công",
            data: created
        })
    } catch (error) {
        next(error)
    }
}
export const getAllTourDepartureController = async (req, res, next) => {
    try {
        const { errors, value } = validatePayload(queryValid, req.body)
        if (errors) return res.status(409).json(errors)
        const tours = await getAllTourDepartureService(value)

        return res.status(200).json({ message: "Danh sách lịch khởi hành tour", tours })
    } catch (error) {
        next(error)
    }
}
export const changeStatusTourDepartureController = async (req, res, next) => {
    try {
        const { status } = req.body
        const id = req.params.id
        const updated = await changeStatusTourDepartureService(id, status)
        return res.status(200).json({ message: updated.changedRows !== 0 ? "Cập nhật trạng thái thành công" : "Dữ liệu không thay đổi", updated })
    } catch (error) {
        next(error)
    }
}