"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPhimRouter = void 0;
var express_1 = require("express");
var phim_controller_1 = require("../controllers/phim.controller");
var phim_schema_1 = require("../schemas/phim.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
/* ----- Public router: client xem phim ----- */
var publicRouter = (0, express_1.Router)();
publicRouter.get('/', (0, validate_1.validate)({ query: phim_schema_1.listPhimQuerySchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.listPublic));
publicRouter.get('/:id', (0, validate_1.validate)({ params: phim_schema_1.idParamSchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.getById));
/* ----- Admin router: quản lý phim ----- */
exports.adminPhimRouter = (0, express_1.Router)();
exports.adminPhimRouter.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
exports.adminPhimRouter.get('/', (0, validate_1.validate)({ query: phim_schema_1.listPhimQuerySchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.listAdmin));
exports.adminPhimRouter.post('/', (0, validate_1.validate)({ body: phim_schema_1.createPhimSchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.create));
exports.adminPhimRouter.get('/:id', (0, validate_1.validate)({ params: phim_schema_1.idParamSchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.detailAdmin));
exports.adminPhimRouter.patch('/:id', (0, validate_1.validate)({ params: phim_schema_1.idParamSchema, body: phim_schema_1.updatePhimSchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.update));
exports.adminPhimRouter.delete('/:id', (0, validate_1.validate)({ params: phim_schema_1.idParamSchema }), (0, async_1.asyncHandler)(phim_controller_1.phimController.remove));
exports.default = publicRouter;
