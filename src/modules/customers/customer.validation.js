import Joi from "joi"

export const customerValid = Joi.object({
    fullName: Joi.string().trim().max(255).required().messages({
        "any.required": "Không được bỏ trống trường này",
        "string.empty": "Không được bỏ trống trường này",
        "string.max": "Không điền quá {#limit} ký tự",
    }),
    email: Joi.string().trim().email().allow("", null).messages({
        "string.email": "Email không hợp lệ"
    }),
    phone: Joi.string().trim().allow("", null).max(20).messages({
        "string.max": "Không điền quá {#limit} ký tự"
    }),
    address: Joi.string().trim().allow("", null).max(255).messages({
        "string.max": "Không điền quá {#limit} ký tự"
    }),
    type: Joi.string().valid("adult", "child").default("adult"),
    notes: Joi.string().trim().allow("", null).max(255).messages({
        "string.max": "Không điền quá {#limit} ký tự"
    }),
})

