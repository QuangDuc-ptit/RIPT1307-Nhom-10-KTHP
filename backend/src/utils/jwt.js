"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuration = exports.verifyTicketToken = exports.signTicketToken = exports.verifyResetToken = exports.signResetToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var env_1 = require("@/config/env");
var signAccessToken = function (payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, {
        expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN,
    });
};
exports.signAccessToken = signAccessToken;
var signRefreshToken = function (payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_REFRESH_SECRET, {
        expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN,
    });
};
exports.signRefreshToken = signRefreshToken;
var verifyAccessToken = function (token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
var verifyRefreshToken = function (token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
var signResetToken = function (payload) {
    var _a;
    return jsonwebtoken_1.default.sign(payload, (_a = env_1.env.JWT_RESET_SECRET) !== null && _a !== void 0 ? _a : env_1.env.JWT_ACCESS_SECRET, {
        expiresIn: env_1.env.JWT_RESET_EXPIRES_IN,
    });
};
exports.signResetToken = signResetToken;
var verifyResetToken = function (token) { var _a; return jsonwebtoken_1.default.verify(token, (_a = env_1.env.JWT_RESET_SECRET) !== null && _a !== void 0 ? _a : env_1.env.JWT_ACCESS_SECRET); };
exports.verifyResetToken = verifyResetToken;
var signTicketToken = function (payload) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.TICKET_SECRET, {
        expiresIn: env_1.env.TICKET_EXPIRES_IN,
        jwtid: payload.jti,
    });
};
exports.signTicketToken = signTicketToken;
var verifyTicketToken = function (token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.TICKET_SECRET);
};
exports.verifyTicketToken = verifyTicketToken;
/**
 * Parse "7d", "15m", "1h" sang số ms để tính thời điểm hết hạn cho DB.
 */
var parseDuration = function (s) {
    var m = /^(\d+)([smhd])$/.exec(s);
    if (!m)
        return 0;
    var n = Number(m[1]);
    switch (m[2]) {
        case 's':
            return n * 1000;
        case 'm':
            return n * 60 * 1000;
        case 'h':
            return n * 60 * 60 * 1000;
        case 'd':
            return n * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
};
exports.parseDuration = parseDuration;
