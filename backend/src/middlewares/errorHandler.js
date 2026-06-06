"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
var errors_1 = require("@/utils/errors");
var env_1 = require("@/config/env");
/**
 * Error handler tập trung. Đặt CUỐI CÙNG sau tất cả route.
 *
 * - HttpError -> map sang status + code chuẩn
 * - Lỗi khác -> 500, ẩn chi tiết khi production
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var errorHandler = function (err, _req, res, _next) {
    if (err instanceof errors_1.HttpError) {
        return res.status(err.status).json({
            success: false,
            error: { code: err.code, message: err.message, details: err.details },
        });
    }
    console.error('[UNHANDLED ERROR]', err);
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: env_1.env.isProd
                ? 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.'
                : (err === null || err === void 0 ? void 0 : err.message) || 'Internal server error',
        },
    });
};
exports.errorHandler = errorHandler;
var notFoundHandler = function (_req, res) {
    res.status(404).json({
        success: false,
        error: { code: 'ROUTE_NOT_FOUND', message: 'Không tìm thấy endpoint' },
    });
};
exports.notFoundHandler = notFoundHandler;
