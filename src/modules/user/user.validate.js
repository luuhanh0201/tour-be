import Joi from "joi";

export const userUpdateValid = Joi.object({
    fullName: Joi.string().required().trim().min(1).messages({
        "string.empty": "Không bỏ trống trường này",
        "any.required": "Không bỏ trống trường này"
    }),

    username: Joi.string().required().trim().min(6).messages({
        "string.min": "Vui lòng điền tối thiểu {#limit} ký tự",
        "string.empty": "Không bỏ trống trường này",
        "any.required": "Không bỏ trống trường này"

    }),

    email: Joi.string().trim().email().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Không bỏ trống trường này",
        "any.required": "Không bỏ trống trường này"

    }),

    role: Joi.string().trim().lowercase().valid("admin", "guide", "null").messages({
        "any.only": "Role chỉ được là admin hoặc guide",
    }),

    isBlock: Joi.alternatives().try(
        Joi.boolean(),
        Joi.number().valid(0, 1),
        Joi.string().valid("0", "1", "true", "false")
    ).messages({
        "alternatives.match": "isBlock không hợp lệ",
    }),

    phone: Joi.string().trim().pattern(/^[0-9+()\-\s]{7,20}$/).messages({
        "string.pattern.base": "Số điện thoại không hợp lệ",

    }),

    dateOfBirth: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
            "string.pattern.base": "Ngày sinh phải theo chuẩn YYYY-MM-DD",
            "string.base": "Ngày sinh không hợp lệ",
        }),

    avatar: Joi.string().trim().uri().messages({
        "string.uri": "Avatar phải là đường dẫn hợp lệ",
    }),

    languages: Joi.array()
        .items(Joi.string().trim())
        .allow(null)
        .messages({
            "array.base": "Languages phải là mảng",
        }),
    certificates: Joi.string().trim(),
    experienceYears: Joi.number().integer().min(0).max(80).messages({
        "number.base": "Số năm kinh nghiệm không hợp lệ",
    }),

    bio: Joi.string().trim().allow(""),
    employmentStatus: Joi.string().valid("active", "on_leave", "terminated").allow("active").trim().messages({
        "any.only": "Trạng thái không tồn tại, vui lòng chọn lại"
    }),
    workingStatus: Joi.string().valid("available", "on_tour", "busy").allow("available").trim().messages({
        "any.only": "Trạng thái không tồn tại, vui lòng chọn lại"
    }),
})
    // chặn field lạ
    .unknown(false)
    // đảm bảo có ít nhất 1 field để update (ngoài userId)
    .custom((value, helpers) => {
        const { userId, ...rest } = value;
        if (Object.keys(rest).length === 0) {
            return helpers.error("any.custom");
        }
        return value;
    })
    .messages({
        "any.custom": "Bạn chưa gửi trường nào để cập nhật",
    });
