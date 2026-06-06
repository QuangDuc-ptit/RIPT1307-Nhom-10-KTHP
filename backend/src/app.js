"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var env_1 = require("./config/env");
var errorHandler_1 = require("./middlewares/errorHandler");
var xac_thuc_route_1 = require("./modules/xac-thuc/routes/xac-thuc.route");
var nguoi_dung_route_1 = require("./modules/nguoi-dung/routes/nguoi-dung.route");
var bai_viet_route_1 = require("./modules/bai-viet/routes/bai-viet.route");
var rap_chieu_route_1 = require("./modules/rap-chieu/routes/rap-chieu.route");
var phong_chieu_route_1 = require("./modules/phong-chieu/routes/phong-chieu.route");
var phim_route_1 = require("./modules/phim/routes/phim.route");
var the_loai_route_1 = require("./modules/the-loai/routes/the-loai.route");
var dat_ve_route_1 = require("./modules/dat-ve/routes/dat-ve.route");
var soat_ve_route_1 = require("./modules/soat-ve/routes/soat-ve.route");
var suat_chieu_route_1 = require("./modules/suat-chieu/routes/suat-chieu.route");
var thanh_toan_route_1 = require("./modules/thanh-toan/routes/thanh-toan.route");
var cron_1 = require("./jobs/cron");
var buildApp = function () {
    var app = (0, express_1.default)();
    // Khởi động các tiến trình chạy ngầm
    (0, cron_1.startCronJobs)();
    /* ---------- Middleware cơ bản ---------- */
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: function (origin, cb) {
            // Cho phép request không có origin (Postman, curl)
            if (!origin)
                return cb(null, true);
            if (env_1.env.corsOrigins.includes(origin))
                return cb(null, true);
            return cb(new Error("CORS blocked: ".concat(origin)));
        },
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    if (!env_1.env.isProd)
        app.use((0, morgan_1.default)('dev'));
    /* ---------- Routes ---------- */
    app.get('/api/health', function (_req, res) { return res.json({ success: true, data: { ok: true } }); });
    app.use('/api/auth', xac_thuc_route_1.default);
    app.use('/api/users', nguoi_dung_route_1.default);
    app.use('/api/posts', bai_viet_route_1.default);
    app.use('/api/dat-ve', dat_ve_route_1.default);
    app.use('/api/payments', thanh_toan_route_1.default);
    app.use('/api/staff', soat_ve_route_1.default);
    app.use('/api/admin/users', nguoi_dung_route_1.adminUsersRouter);
    app.use('/api/admin/posts', bai_viet_route_1.adminPostsRouter);
    app.use('/api/admin/rap-chieu', rap_chieu_route_1.default);
    app.use('/api/admin/phong-chieu', phong_chieu_route_1.default);
    app.use('/api/admin/suat-chieu', suat_chieu_route_1.default);
    app.use('/api/movies', phim_route_1.default);
    app.use('/api/admin/movies', phim_route_1.adminPhimRouter);
    app.use('/api/genres', the_loai_route_1.default);
    app.use('/api/admin/genres', the_loai_route_1.adminTheLoaiRouter);
    /* ---------- 404 + Error handler (đặt CUỐI) ---------- */
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.buildApp = buildApp;
