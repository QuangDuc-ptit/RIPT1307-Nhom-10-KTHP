"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflict = exports.notFound = exports.forbidden = exports.unauthorized = exports.badRequest = exports.HttpError = void 0;
/**
 * Lớp lỗi tuỳ biến để service/controller dễ throw.
 * `errorHandler` sẽ map sang HTTP response chuẩn.
 *
 * Cách dùng:
 *   throw new HttpError(404, 'NOT_FOUND', 'Không tìm thấy bài viết');
 */
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(status, code, message, details) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.code = code;
        _this.details = details;
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
var badRequest = function (msg, details) {
    return new HttpError(400, 'BAD_REQUEST', msg, details);
};
exports.badRequest = badRequest;
var unauthorized = function (msg) {
    if (msg === void 0) { msg = 'Cần đăng nhập'; }
    return new HttpError(401, 'UNAUTHORIZED', msg);
};
exports.unauthorized = unauthorized;
var forbidden = function (msg) {
    if (msg === void 0) { msg = 'Không có quyền'; }
    return new HttpError(403, 'FORBIDDEN', msg);
};
exports.forbidden = forbidden;
var notFound = function (msg) {
    if (msg === void 0) { msg = 'Không tìm thấy'; }
    return new HttpError(404, 'NOT_FOUND', msg);
};
exports.notFound = notFound;
var conflict = function (msg) { return new HttpError(409, 'CONFLICT', msg); };
exports.conflict = conflict;
