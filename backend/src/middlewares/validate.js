"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var zod_1 = require("zod");
var errors_1 = require("@/utils/errors");
var validate = function (schemas) { return function (req, _res, next) {
    try {
        if (schemas.body)
            req.body = schemas.body.parse(req.body);
        if (schemas.query)
            req.query = schemas.query.parse(req.query);
        if (schemas.params)
            req.params = schemas.params.parse(req.params);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            return next((0, errors_1.badRequest)('Dữ liệu không hợp lệ', e.flatten()));
        }
        next(e);
    }
}; };
exports.validate = validate;
