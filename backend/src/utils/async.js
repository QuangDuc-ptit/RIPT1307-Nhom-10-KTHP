"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * Wrap async handler để tự đẩy lỗi vào errorHandler.
 *
 * Lý do: Express 4 không tự catch promise rejection trong async function.
 * Nếu không wrap, lỗi sẽ rớt vào unhandledRejection -> không trả về cho client.
 *
 * Cách dùng:
 *   router.get('/me', asyncHandler(async (req, res) => { ... }));
 */
var asyncHandler = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
