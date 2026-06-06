"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var rap_chieu_controller_1 = require("../controllers/rap-chieu.controller");
var rap_chieu_schema_1 = require("../schemas/rap-chieu.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
var router = (0, express_1.Router)();
// Toàn bộ module rạp chiếu yêu cầu quyền ADMIN
router.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
router.get('/', (0, async_1.asyncHandler)(rap_chieu_controller_1.rapChieuController.list));
router.post('/', (0, validate_1.validate)({ body: rap_chieu_schema_1.createCinemaSchema }), (0, async_1.asyncHandler)(rap_chieu_controller_1.rapChieuController.create));
router.get('/:id', (0, validate_1.validate)({ params: rap_chieu_schema_1.idParamSchema }), (0, async_1.asyncHandler)(rap_chieu_controller_1.rapChieuController.detail));
router.patch('/:id', (0, validate_1.validate)({ params: rap_chieu_schema_1.idParamSchema, body: rap_chieu_schema_1.updateCinemaSchema }), (0, async_1.asyncHandler)(rap_chieu_controller_1.rapChieuController.update));
router.delete('/:id', (0, validate_1.validate)({ params: rap_chieu_schema_1.idParamSchema }), (0, async_1.asyncHandler)(rap_chieu_controller_1.rapChieuController.remove));
exports.default = router;
