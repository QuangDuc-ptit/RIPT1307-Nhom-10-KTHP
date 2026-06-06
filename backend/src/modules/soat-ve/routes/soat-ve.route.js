"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var soat_ve_controller_1 = require("../controllers/soat-ve.controller");
var soat_ve_schema_1 = require("../schemas/soat-ve.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
var client_1 = require("@prisma/client");
var router = (0, express_1.Router)();
// Yêu cầu đăng nhập và có quyền STAFF hoặc ADMIN
router.use(auth_1.requireAuth, (0, auth_1.requireRole)(client_1.Role.STAFF, client_1.Role.ADMIN));
router.post('/scan', (0, validate_1.validate)({ body: soat_ve_schema_1.scanTicketSchema }), (0, async_1.asyncHandler)(soat_ve_controller_1.soatVeController.scanTicket));
exports.default = router;
