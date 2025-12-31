import Joi from "joi";

export const serviceValid = Joi.object({
    tourId: Joi.number().integer().min(1).required().messages({
        "number.base": "Tour không tồn tại, vui lòng kiểm tra lại",
        "number.integer": "Tour không tồn tại, vui lòng kiểm tra lại",
        "number.min": "Tour không tồn tại, vui lòng kiểm tra lại",
        "any.required": "Tour không tồn tại, vui lòng kiểm tra lại",
    }),
    serviceType: Joi.string().trim().valid("hotel", "restaurant", "transport", "ticket", "other").default("other").invalid("").messages({
        "string.base": "Loại dịch vụ không hợp lệ",
        "any.only": "Loại dịch vụ không hợp lệ",
        "any.invalid": "Vui lòng chọn loại dịch vụ",
    }),
    serviceName: Joi.string().required().messages({
        "string.empty": "Không bỏ trống trường này",
        "any.required": "Không bỏ trống trường này",
    }),
    contactInfo: Joi.string().allow("", null).max(255).optional().messages({
        "string.max": "Không vượt quá {#limit} kí tự"
    }),
    address: Joi.string().allow("", null).max(255).optional().messages({
        "string.max": "Không vượt quá {#limit} kí tự"
    }),
    description: Joi.string().allow("", null).max(255).optional().messages({
        "string.max": "Không vượt quá {#limit} kí tự"
    })
})