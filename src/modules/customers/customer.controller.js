import { validatePayload } from "../../utils/validatePayload.until.js";
import { queryValid } from "../categories/category.validation.js";
import { customerValid } from "./customer.validation.js";
import {
    findAllCustomerService,
    findCustomerByIdService,
    createCustomerService,
    updateCustomerService,
    deleteCustomerService,
} from "./customer.service.js";
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js";

export const findAllCustomerController = async (req, res, next) => {
    try {
        const { error, value } = queryValid.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.reduce((acc, cur) => {
                acc[cur.path[0]] = cur.message;
                return acc;
            }, {});
            return validationErrorResponse(res, errors, 400);
        }
        const customers = await findAllCustomerService(value || {});
        return successResponse(res, "Danh sách khách hàng", customers, 200);
    } catch (error) {
        next(error);
    }
};

export const findCustomerByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await findCustomerByIdService(id);
        return successResponse(res, "Thông tin khách hàng", customer, 200);
    } catch (error) {
        next(error);
    }
};

export const createCustomerController = async (req, res, next) => {
    try {
        const payload = req.body;
        const { errors, value } = validatePayload(customerValid, payload);
        if (errors) return validationErrorResponse(res, errors, 400);
        const newCustomer = await createCustomerService(value);
        return successResponse(res, "Tạo khách hàng thành công", newCustomer, 201);
    } catch (error) {
        next(error);
    }
};

export const updateCustomerController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await findCustomerByIdService(Number(id));
        const { createdAt, updatedAt, id: customerId, ...rest } = customer || {};
        const newCustomer = { ...rest, ...req.body };
        const { errors, value } = validatePayload(customerValid, newCustomer);
        console.log(newCustomer)
        if (errors) return validationErrorResponse(res, errors, 400);
        const updated = await updateCustomerService({ id: Number(id), ...value });
        return successResponse(res, "Cập nhật thành công", updated, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteCustomerController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteCustomerService(Number(id));
        if (!deleted) return errorResponse(res, "Customer không tồn tại", null, 404);
        return successResponse(res, "Xóa thành công", null, 200);
    } catch (error) {
        next(error);
    }
};

export default {
    findAllCustomerController,
    findCustomerByIdController,
    createCustomerController,
    updateCustomerController,
    deleteCustomerController,
};
