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

export const findAllCustomerController = async (req, res, next) => {
    try {
        const { error, value } = queryValid.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.reduce((acc, cur) => {
                acc[cur.path[0]] = cur.message;
                return acc;
            }, {});
            return res.status(400).json({ errors });
        }
        const customers = await findAllCustomerService(value || {});
        return res.status(200).json(customers);
    } catch (error) {
        next(error);
    }
};

export const findCustomerByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await findCustomerByIdService(id);
        return res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
};

export const createCustomerController = async (req, res, next) => {
    try {
        const payload = req.body;
        const { errors, value } = validatePayload(customerValid, payload);
        if (errors) return res.status(400).json(errors);
        const newCustomer = await createCustomerService(value);
        return res.status(201).json({ message: "Tạo khách hàng thành công", data: newCustomer });
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
        if (errors) return res.status(400).json(errors);
        const updated = await updateCustomerService({ id: Number(id), ...value });
        return res.status(200).json({ message: "Cập nhật thành công", updated });
    } catch (error) {
        next(error);
    }
};

export const deleteCustomerController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await deleteCustomerService(Number(id));
        if (!deleted) return res.status(404).json({ message: "Customer không tồn tại" });
        return res.status(200).json({ message: "Xóa thành công" });
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
