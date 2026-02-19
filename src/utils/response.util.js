/**
 * Utility để chuẩn hóa response từ server
 * Định dạng: { message: string, data: any }
 */

export const successResponse = (res, message = "Thành công", data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        message,
        data
    });
};

export const errorResponse = (res, message = "Lỗi hệ thống", data = null, statusCode = 500) => {
    return res.status(statusCode).json({
        message,
        data
    });
};

export const validationErrorResponse = (res, errors = {}, statusCode = 400) => {
    return res.status(statusCode).json({
        message: "Lỗi xác thực dữ liệu",
        data: errors
    });
};
