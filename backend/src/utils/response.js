"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.noContent = exports.created = exports.ok = void 0;
/**
 * Helper trả về response theo format chuẩn:
 *   - thành công: { success: true, data }
 *   - thất bại:   { success: false, error: { code, message, details? } }
 *
 * Lý do dùng format này:
 *   - frontend luôn biết chỗ nào là data, chỗ nào là error
 *   - axios interceptor unwrap tự động (xem client/admin)
 */
var ok = function (res, data, status) {
    if (status === void 0) { status = 200; }
    return res.status(status).json({ success: true, data: data });
};
exports.ok = ok;
var created = function (res, data) { return (0, exports.ok)(res, data, 201); };
exports.created = created;
var noContent = function (res) { return res.status(204).send(); };
exports.noContent = noContent;
var fail = function (res, status, code, message, details) { return res.status(status).json({ success: false, error: { code: code, message: message, details: details } }); };
exports.fail = fail;
