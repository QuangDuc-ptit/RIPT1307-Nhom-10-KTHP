"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var phong_chieu_controller_1 = require("../controllers/phong-chieu.controller");
var phong_chieu_schema_1 = require("../schemas/phong-chieu.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
var router = (0, express_1.Router)();
// Toàn bộ module phòng chiếu yêu cầu quyền ADMIN
router.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
router.get('/', (0, async_1.asyncHandler)(phong_chieu_controller_1.phongChieuController.list));
router.post('/', (0, validate_1.validate)({ body: phong_chieu_schema_1.createRoomSchema }), (0, async_1.asyncHandler)(phong_chieu_controller_1.phongChieuController.create));
router.get('/:id', (0, validate_1.validate)({ params: phong_chieu_schema_1.idParamSchema }), (0, async_1.asyncHandler)(phong_chieu_controller_1.phongChieuController.detail));
router.patch('/:id', (0, validate_1.validate)({ params: phong_chieu_schema_1.idParamSchema, body: phong_chieu_schema_1.updateRoomSchema }), (0, async_1.asyncHandler)(phong_chieu_controller_1.phongChieuController.update));
router.delete('/:id', (0, validate_1.validate)({ params: phong_chieu_schema_1.idParamSchema }), (0, async_1.asyncHandler)(phong_chieu_controller_1.phongChieuController.remove));
router.post('/:id/sinh-ghe', (0, validate_1.validate)({ params: phong_chieu_schema_1.idParamSchema, body: phong_chieu_schema_1.generateSeatsSchema }), (0, async_1.asyncHandler)(phong_chieu_controller_1.phongChieuController.generateSeats));
exports.default = router;
