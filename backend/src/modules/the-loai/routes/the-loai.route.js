"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTheLoaiRouter = void 0;
var express_1 = require("express");
var the_loai_controller_1 = require("../controllers/the-loai.controller");
var the_loai_schema_1 = require("../schemas/the-loai.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
/* ----- Public router: client xem thể loại ----- */
var publicRouter = (0, express_1.Router)();
publicRouter.get('/', (0, validate_1.validate)({ query: the_loai_schema_1.listTheLoaiQuerySchema }), (0, async_1.asyncHandler)(the_loai_controller_1.theLoaiController.list));
publicRouter.get('/slug/:slug', (0, async_1.asyncHandler)(the_loai_controller_1.theLoaiController.getBySlug));
publicRouter.get('/:id', (0, validate_1.validate)({ params: the_loai_schema_1.idParamSchema }), (0, async_1.asyncHandler)(the_loai_controller_1.theLoaiController.getById));
/* ----- Admin router: quản lý thể loại ----- */
exports.adminTheLoaiRouter = (0, express_1.Router)();
exports.adminTheLoaiRouter.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
exports.adminTheLoaiRouter.post('/', (0, validate_1.validate)({ body: the_loai_schema_1.createTheLoaiSchema }), (0, async_1.asyncHandler)(the_loai_controller_1.theLoaiController.create));
exports.adminTheLoaiRouter.patch('/:id', (0, validate_1.validate)({ params: the_loai_schema_1.idParamSchema, body: the_loai_schema_1.updateTheLoaiSchema }), (0, async_1.asyncHandler)(the_loai_controller_1.theLoaiController.update));
exports.adminTheLoaiRouter.delete('/:id', (0, validate_1.validate)({ params: the_loai_schema_1.idParamSchema }), (0, async_1.asyncHandler)(the_loai_controller_1.theLoaiController.remove));
exports.default = publicRouter;
