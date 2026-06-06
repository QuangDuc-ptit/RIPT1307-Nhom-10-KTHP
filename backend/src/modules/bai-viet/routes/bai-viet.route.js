"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPostsRouter = void 0;
var express_1 = require("express");
var bai_viet_controller_1 = require("../controllers/bai-viet.controller");
var bai_viet_schema_1 = require("../schemas/bai-viet.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
/* ----- Public router: client xem được ----- */
var publicRouter = (0, express_1.Router)();
publicRouter.get('/', (0, validate_1.validate)({ query: bai_viet_schema_1.listQuerySchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.listPublic));
publicRouter.get('/slug/:slug', (0, validate_1.validate)({ params: bai_viet_schema_1.slugParamSchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.getBySlug));
publicRouter.get('/:id', (0, validate_1.validate)({ params: bai_viet_schema_1.idParamSchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.getById));
/* ----- Admin router: cần đăng nhập + role ADMIN ----- */
exports.adminPostsRouter = (0, express_1.Router)();
exports.adminPostsRouter.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
exports.adminPostsRouter.get('/', (0, validate_1.validate)({ query: bai_viet_schema_1.listQuerySchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.listAdmin));
exports.adminPostsRouter.post('/', (0, validate_1.validate)({ body: bai_viet_schema_1.createPostSchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.create));
exports.adminPostsRouter.get('/:id', (0, validate_1.validate)({ params: bai_viet_schema_1.idParamSchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.detailAdmin));
exports.adminPostsRouter.patch('/:id', (0, validate_1.validate)({ params: bai_viet_schema_1.idParamSchema, body: bai_viet_schema_1.updatePostSchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.update));
exports.adminPostsRouter.delete('/:id', (0, validate_1.validate)({ params: bai_viet_schema_1.idParamSchema }), (0, async_1.asyncHandler)(bai_viet_controller_1.postsController.remove));
exports.default = publicRouter;
