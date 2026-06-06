"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dat_ve_controller_1 = require("../controllers/dat-ve.controller");
var booking_controller_1 = require("../controllers/booking.controller");
var dat_ve_schema_1 = require("../schemas/dat-ve.schema");
var booking_schema_1 = require("../schemas/booking.schema");
var validate_1 = require("@/middlewares/validate");
var auth_1 = require("@/middlewares/auth");
var async_1 = require("@/utils/async");
var router = (0, express_1.Router)();
// Yêu cầu user phải đăng nhập mới được giữ ghế
router.use(auth_1.requireAuth);
router.post('/giu-ghe', (0, validate_1.validate)({ body: dat_ve_schema_1.giuGheSchema }), (0, async_1.asyncHandler)(dat_ve_controller_1.datVeController.giuGhe));
router.post('/booking', (0, validate_1.validate)({ body: booking_schema_1.createBookingSchema }), (0, async_1.asyncHandler)(booking_controller_1.bookingController.createBooking));
exports.default = router;
