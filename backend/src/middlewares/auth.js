"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
var jwt_1 = require("@/utils/jwt");
var errors_1 = require("@/utils/errors");
/**
 * Gắn `req.user` nếu request có Bearer token hợp lệ. Nếu không có hoặc sai -> 401.
 *
 * Dùng cho route bắt buộc đăng nhập.
 */
var requireAuth = function (req, _res, next) {
    var header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next((0, errors_1.unauthorized)());
    }
    var token = header.slice('Bearer '.length);
    try {
        var decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: decoded.sub, role: decoded.role };
        next();
    }
    catch (_a) {
        next((0, errors_1.unauthorized)('Token không hợp lệ hoặc đã hết hạn'));
    }
};
exports.requireAuth = requireAuth;
/**
 * Sau khi `requireAuth` đã chạy, kiểm tra role.
 */
var requireRole = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, _res, next) {
        var user = req.user;
        if (!user)
            return next((0, errors_1.unauthorized)());
        if (!roles.includes(user.role))
            return next((0, errors_1.forbidden)());
        next();
    };
};
exports.requireRole = requireRole;
