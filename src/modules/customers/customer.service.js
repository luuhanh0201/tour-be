import {
  findAllCustomerModel,
  findCustomerByIdModel,
  findCustomerByPhoneOrEmailModel,
  createCustomerModel,
  updateCustomerModel,
  deleteCustomerModel,
} from "./customer.model.js";

export const findAllCustomerService = async (payload = {}) => {
  const { limit = 10, page = 1, q = "" } = payload;
  const customers = await findAllCustomerModel({ page, limit, q });
  return customers;
};

export const findCustomerByIdService = async (id) => {
  const { exists, customer } = await findCustomerByIdModel({ id });
  if (!exists) {
    const error = new Error("Customer không tồn tại");
    error.name = "CUSTOMER_NOT_FOUND";
    error.status = 404;
    throw error;
  }
  return customer;
};

export const createCustomerService = async (payload = {}) => {
  const { fullName, phone, email } = payload;
  if (!fullName) {
    const error = new Error("fullName là bắt buộc");
    error.status = 400;
    throw error;
  }
  const { exists } = await findCustomerByPhoneOrEmailModel({ phone, email });
  if (exists) {
    const error = new Error("Khách hàng đã tồn tại");
    error.status = 409;
    throw error;
  }
  const result = await createCustomerModel(payload);
  return result || null;
};

export const updateCustomerService = async (payload = {}) => {
  const { id } = payload;
  const { exists } = await findCustomerByIdModel({ id });
  if (!exists) {
    const error = new Error("Customer không tồn tại");
    error.name = "CUSTOMER_NOT_FOUND";
    error.status = 404;
    throw error;
  }
  const result = await updateCustomerModel(payload);
  return result || null;
};

export const deleteCustomerService = async (id) => {
  const { exists } = await findCustomerByIdModel({ id });
  if (!exists) {
    const error = new Error("Customer không tồn tại");
    error.name = "CUSTOMER_NOT_FOUND";
    error.status = 404;
    throw error;
  }
  const deleted = await deleteCustomerModel(id);
  return deleted;
};

export default {
  findAllCustomerService,
  findCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
};
