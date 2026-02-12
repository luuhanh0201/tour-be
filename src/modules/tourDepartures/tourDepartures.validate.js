import Joi from "joi";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/; // HH:mm or HH:mm:ss

export const departureValid = Joi.object({
    tourId: Joi.number().integer().positive().required().messages({
        "any.required": "Vui lòng chọn tour",
        "number.base": "tourId phải là số",
        "number.integer": "tourId phải là số nguyên",
        "number.positive": "tourId phải lớn hơn 0"
    }),

    guideId: Joi.number().integer().positive().allow(null).messages({
        "number.base": "guideId phải là số",
        "number.integer": "guideId phải là số nguyên",
        "number.positive": "guideId phải lớn hơn 0"
    }),

    departureCode: Joi.string().default("").messages({
        "any.required": "Vui lòng nhập mã chuyến (departureCode)"
    }),

    departureDay: Joi.string().pattern(DATE_REGEX).required().messages({
        "any.required": "Vui lòng chọn ngày khởi hành",
        "string.pattern.base": "departureDay phải đúng định dạng YYYY-MM-DD"
    }),

    departureTime: Joi.string().pattern(TIME_REGEX).required().messages({
        "any.required": "Vui lòng chọn giờ khởi hành",
        "string.pattern.base": "departureTime phải đúng định dạng HH:mm hoặc HH:mm:ss"
    }),

    returnDay: Joi.string().pattern(DATE_REGEX).required().messages({
        "any.required": "Vui lòng chọn ngày kết thúc",
        "string.pattern.base": "returnDay phải đúng định dạng YYYY-MM-DD"
    }),

    returnTime: Joi.string().pattern(TIME_REGEX).required().messages({
        "any.required": "Vui lòng nhập giờ kết thúc",
        "string.pattern.base": "returnTime phải đúng định dạng HH:mm hoặc HH:mm:ss"
    }),

    meetingPoint: Joi.string().trim().max(255).required().messages({
        "any.required": "Vui lòng nhập điểm tập trung"
    }),

    meetingTime: Joi.string().pattern(TIME_REGEX).required().messages({
        "any.required": "Vui lòng nhập giờ tập trung",
        "string.pattern.base": "meetingTime phải đúng định dạng HH:mm hoặc HH:mm:ss"
    }),

    driverName: Joi.string().trim().max(100).allow("", null),
    driverPhone: Joi.string().trim().max(20).allow("", null),
    vehicleInfo: Joi.string().trim().max(255).allow("", null),

    currentParticipants: Joi.number().integer().min(0).default(0).messages({
        "number.base": "currentParticipants phải là số",
        "number.integer": "currentParticipants phải là số nguyên",
        "number.min": "currentParticipants không được âm"
    }),

    maxParticipants: Joi.number().integer().min(1).required().messages({
        "any.required": "Vui lòng nhập số khách tối đa",
        "number.base": "maxParticipants phải là số",
        "number.integer": "maxParticipants phải là số nguyên",
        "number.min": "maxParticipants phải >= 1"
    }),

    status: Joi.string()
        .valid("scheduled", "in_progress", "completed", "cancelled")
        .required()
        .messages({
            "any.only": "status chỉ được là scheduled | in_progress | completed | cancelled",
            "any.required": "Vui lòng chọn trạng thái"
        }),

    notes: Joi.string().trim().max(500).allow("", null)
})
    .custom((value, helpers) => {
        const { departureDay, returnDay } = value;
        const dep = new Date(departureDay);
        const ret = new Date(returnDay);
        if (ret < dep) {
            return helpers.message("Ngày kết thúc không được nhỏ hơn ngày khởi hành");
        }
        return value;
    })
    .custom((value, helpers) => {
        const { currentParticipants = 0, maxParticipants } = value;
        if (currentParticipants > maxParticipants) {
            return helpers.message("Số khách hiện tại không được lớn hơn số khách tối đa");
        }
        return value;
    });
