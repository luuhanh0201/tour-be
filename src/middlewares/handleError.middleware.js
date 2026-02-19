export const errorHandler = async (err, req, res, next) => {
    return await res.status(err.status || 500).json({
        message: err.message || "Lỗi hệ thống",
        data: null
    });
};