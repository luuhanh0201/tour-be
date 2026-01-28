import Joi from "joi";

export const tourValid = Joi.object({
    name: Joi.string().trim().max(255).required().messages({
        "any.required": "Không thể bỏ trống dòng này."
    }),
    categoryId: Joi.number().integer().min(1).required().messages({
        "number.base": "Danh mục không tồn tại, vui lòng kiểm tra lại",
        "number.integer": "Danh mục không tồn tại, vui lòng kiểm tra lại",
        "number.min": "Danh mục không tồn tại, vui lòng kiểm tra lại",
        "any.required": "Danh mục không tồn tại, vui lòng kiểm tra lại",
    }),
    durationDays: Joi.number().integer().min(1).required().messages({
        "number.base": "Số ngày không hợp lệ",
        "number.integer": "Số ngày không hợp lệ",
        "number.min": "Số ngày phải >= 1",
        "any.required": "Vui lòng nhập số ngày",
    }),

    durationNights: Joi.number().integer().min(0).required().messages({
        "number.base": "Số đêm không hợp lệ",
        "number.integer": "Số đêm không hợp lệ",
        "number.min": "Số đêm phải >= 0",
        "any.required": "Vui lòng nhập số đêm",
    }),
    description: Joi.string().allow("", null),
    highlights: Joi.string().allow("", null),
    basePrice: Joi.number().min(0).required().messages({
        "number.base": "Giá cơ bản không hợp lệ",
        "number.min": "Giá cơ bản không được âm",
        "any.required": "Vui lòng nhập giá cơ bản",
    }),
    status: Joi.string().valid("active", "inactive").default("active"),

})