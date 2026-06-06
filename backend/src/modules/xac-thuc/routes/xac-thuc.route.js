"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var xac_thuc_controller_1 = require("../controllers/xac-thuc.controller");
var xac_thuc_schema_1 = require("../schemas/xac-thuc.schema");
var xac_thuc_schema_2 = require("../schemas/xac-thuc.schema");
var xac_thuc_schema_3 = require("../schemas/xac-thuc.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
var router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)({ body: xac_thuc_schema_1.registerSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.register));
router.post('/login', (0, validate_1.validate)({ body: xac_thuc_schema_1.loginSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.login));
router.post('/social-login', (0, validate_1.validate)({ body: xac_thuc_schema_2.socialLoginSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.socialLogin));
router.post('/quen-mat-khau', (0, validate_1.validate)({ body: xac_thuc_schema_3.quenMatKhauSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.quenMatKhau));
router.post('/dat-lai-mat-khau', (0, validate_1.validate)({ body: xac_thuc_schema_3.datLaiMatKhauSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.datLaiMatKhau));
// Dev-only route to preview reset email without DB
if (process.env.NODE_ENV !== 'production') {
    router.post('/_dev/send-reset', (0, validate_1.validate)({ body: xac_thuc_schema_3.quenMatKhauSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.devSendReset));
}
router.post('/refresh', (0, validate_1.validate)({ body: xac_thuc_schema_1.refreshSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.refresh));
router.post('/logout', (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.logout));
router.get('/me', auth_1.requireAuth, (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.me));
router.post('/change-password', auth_1.requireAuth, (0, validate_1.validate)({ body: xac_thuc_schema_1.changePasswordSchema }), (0, async_1.asyncHandler)(xac_thuc_controller_1.xacThucController.changePassword));
exports.default = router;
