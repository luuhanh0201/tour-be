import { createServiceModel, deleteServiceModel, findAllServiceModel, findServiceByIdModel, findServiceByNameModel, updateServiceModel } from "./service.model.js"

export const findAllServiceService = async (payload = {}) => {
    const { limit = 10, page = 1, q = "" } = payload
    const tourServices = await findAllServiceModel({ page: page, limit: limit, q: q })
    return tourServices
}

export const createServiceService = async (payload = {}) => {
    const { tourId, serviceType, serviceName, contactInfo = "", address = "", description = "" } = payload
    const { exists } = await findServiceByNameModel({ serviceName: serviceName })
    if (exists) {
        const error = new Error("Dịch vụ này đã tồn tại.")
        error.name = "SERVICE_ERROR"
        error.status = 409
        throw error
    }
    const newService = await createServiceModel({ tourId, serviceType, serviceName, contactInfo, address, description })
    return newService || null
}
export const updateServiceService = async (payload = {}) => {
    const { id, tourId, serviceType, serviceName, contactInfo, address, description } = payload

    const { exists, service: dataService } = await findServiceByNameModel({ serviceName })
    if (exists && Number(id) !== dataService.id) {
        const error = new Error("Dịch vụ này đã tồn tại, vui lòng kiểm tra lại.")
        error.name = "SERVICE_ERROR"
        error.status = 409
        throw error
    }
    const newService = await updateServiceModel({ serviceId: id, tourId, serviceType, serviceName, contactInfo, address, description })
    if (newService.affectedRows === 0) {
        const error = new Error("Update thất bại")
        error.name = "SERVICE_ERROR"
        error.status = 409
    }
    const { service } = await findServiceByIdModel({ id })
    return { message: "Update thành công", service } || null

}
export const deleteServiceService = async (id) => {

    const deleted = await deleteServiceModel(id)
    if (!deleted) {
        const error = new Error("Không tìm thấy dịch vụ cần xoá")
        error.name = "SERVICE_ERROR"
        error.status = 409
        throw error
    }
    return { message: "Xoá thành công", deleted }
}