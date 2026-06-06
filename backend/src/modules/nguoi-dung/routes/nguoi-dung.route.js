"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUsersRouter = void 0;
var express_1 = require("express");
var nguoi_dung_controller_1 = require("../controllers/nguoi-dung.controller");
var nguoi_dung_schema_1 = require("../schemas/nguoi-dung.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
var router = (0, express_1.Router)();
/* ----- Endpoints cho mọi user đã đăng nhập ----- */
router.patch('/me', auth_1.requireAuth, (0, validate_1.validate)({ body: nguoi_dung_schema_1.updateMeSchema }), (0, async_1.asyncHandler)(nguoi_dung_controller_1.usersController.updateMe));
/* ----- Endpoints chỉ cho ADMIN: mount dưới prefix /admin/users ở app.ts ----- */
exports.adminUsersRouter = (0, express_1.Router)();
exports.adminUsersRouter.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
exports.adminUsersRouter.get('/', (0, validate_1.validate)({ query: nguoi_dung_schema_1.listQuerySchema }), (0, async_1.asyncHandler)(nguoi_dung_controller_1.usersController.list));
exports.adminUsersRouter.post('/', (0, validate_1.validate)({ body: nguoi_dung_schema_1.createUserSchema }), (0, async_1.asyncHandler)(nguoi_dung_controller_1.usersController.create));
exports.adminUsersRouter.get('/:id', (0, validate_1.validate)({ params: nguoi_dung_schema_1.idParamSchema }), (0, async_1.asyncHandler)(nguoi_dung_controller_1.usersController.detail));
exports.adminUsersRouter.patch('/:id', (0, validate_1.validate)({ params: nguoi_dung_schema_1.idParamSchema, body: nguoi_dung_schema_1.updateUserSchema }), (0, async_1.asyncHandler)(nguoi_dung_controller_1.usersController.update));
exports.adminUsersRouter.delete('/:id', (0, validate_1.validate)({ params: nguoi_dung_schema_1.idParamSchema }), (0, async_1.asyncHandler)(nguoi_dung_controller_1.usersController.remove));
exports.default = router;
