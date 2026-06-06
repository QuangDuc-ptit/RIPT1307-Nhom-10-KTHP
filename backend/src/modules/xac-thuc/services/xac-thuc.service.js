"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xacThucService = void 0;
var bcryptjs_1 = require("bcryptjs");
var db_1 = require("@/config/db");
var env_1 = require("@/config/env");
var errors_1 = require("@/utils/errors");
var jwt_1 = require("@/utils/jwt");
var firebase_1 = require("@/config/firebase");
var crypto_1 = require("crypto");
var jwt_2 = require("@/utils/jwt");
var email_1 = require("@/utils/email");
var toPublicUser = function (u) { return ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: u.avatar,
    createdAt: u.createdAt.toISOString(),
}); };
var issueTokens = function (userId, role) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken, expiresAt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessToken = (0, jwt_1.signAccessToken)({ sub: userId, role: role });
                refreshToken = (0, jwt_1.signRefreshToken)({ sub: userId, role: role });
                expiresAt = new Date(Date.now() + (0, jwt_1.parseDuration)(env_1.env.JWT_REFRESH_EXPIRES_IN));
                return [4 /*yield*/, db_1.prisma.refreshToken.create({
                        data: { token: refreshToken, userId: userId, expiresAt: expiresAt },
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
        }
    });
}); };
exports.xacThucService = {
    register: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, passwordHash, user, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: input.email } })];
                    case 1:
                        existing = _a.sent();
                        if (existing)
                            throw (0, errors_1.conflict)('Email đã được sử dụng');
                        return [4 /*yield*/, bcryptjs_1.default.hash(input.password, 10)];
                    case 2:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, db_1.prisma.user.create({
                                data: { email: input.email, passwordHash: passwordHash, name: input.name, role: 'USER' },
                            })];
                    case 3:
                        user = _a.sent();
                        return [4 /*yield*/, issueTokens(user.id, user.role)];
                    case 4:
                        tokens = _a.sent();
                        return [2 /*return*/, __assign({ user: toPublicUser(user) }, tokens)];
                }
            });
        });
    },
    socialLogin: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, e_1, email, name, avatar, providerId, user, random, passwordHash, data, data, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (input.provider !== 'google')
                            throw (0, errors_1.unauthorized)('Provider không hỗ trợ');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, firebase_1.admin.auth().verifyIdToken(input.idToken)];
                    case 2:
                        payload = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw (0, errors_1.unauthorized)('Token provider không hợp lệ');
                    case 4:
                        email = payload.email;
                        name = payload.name || payload.displayName;
                        avatar = payload.picture || payload.photoURL;
                        providerId = payload.uid;
                        if (!email)
                            throw (0, errors_1.unauthorized)('Provider token không chứa email');
                        if (!providerId)
                            throw (0, errors_1.unauthorized)('Provider token không chứa uid');
                        return [4 /*yield*/, db_1.prisma.user.findUnique({
                                where: {
                                    provider_providerId: {
                                        provider: input.provider,
                                        providerId: providerId,
                                    },
                                },
                            })];
                    case 5:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 12];
                        return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: email } })];
                    case 6:
                        // Nếu chưa có theo providerId, thử tìm bằng email (trường hợp user đã đăng ký bằng email này trước đó hoặc đăng nhập bằng provider khác có cùng email)
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 9];
                        random = crypto_1.default.randomBytes(16).toString('hex');
                        return [4 /*yield*/, bcryptjs_1.default.hash(random, 10)];
                    case 7:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, db_1.prisma.user.create({
                                data: {
                                    email: email,
                                    name: name !== null && name !== void 0 ? name : email.split('@')[0],
                                    avatar: avatar,
                                    passwordHash: passwordHash,
                                    role: 'USER',
                                    provider: input.provider,
                                    providerId: providerId,
                                },
                            })];
                    case 8:
                        user = _a.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        data = { provider: input.provider, providerId: providerId };
                        if (!user.name && name)
                            data.name = name;
                        if (!user.avatar && avatar)
                            data.avatar = avatar;
                        return [4 /*yield*/, db_1.prisma.user.update({ where: { id: user.id }, data: data })];
                    case 10:
                        user = _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        data = {};
                        if (!user.name && name)
                            data.name = name;
                        if (!user.avatar && avatar)
                            data.avatar = avatar;
                        if (!Object.keys(data).length) return [3 /*break*/, 14];
                        return [4 /*yield*/, db_1.prisma.user.update({ where: { id: user.id }, data: data })];
                    case 13:
                        user = _a.sent();
                        _a.label = 14;
                    case 14: return [4 /*yield*/, issueTokens(user.id, user.role)];
                    case 15:
                        tokens = _a.sent();
                        return [2 /*return*/, __assign({ user: toPublicUser(user) }, tokens)];
                }
            });
        });
    },
    login: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var user, ok, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: input.email } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw (0, errors_1.unauthorized)('Email hoặc mật khẩu không đúng');
                        return [4 /*yield*/, bcryptjs_1.default.compare(input.password, user.passwordHash)];
                    case 2:
                        ok = _a.sent();
                        if (!ok)
                            throw (0, errors_1.unauthorized)('Email hoặc mật khẩu không đúng');
                        return [4 /*yield*/, issueTokens(user.id, user.role)];
                    case 3:
                        tokens = _a.sent();
                        return [2 /*return*/, __assign({ user: toPublicUser(user) }, tokens)];
                }
            });
        });
    },
    refresh: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, stored;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            payload = (0, jwt_1.verifyRefreshToken)(input.refreshToken);
                        }
                        catch (_b) {
                            throw (0, errors_1.unauthorized)('Refresh token không hợp lệ');
                        }
                        return [4 /*yield*/, db_1.prisma.refreshToken.findUnique({ where: { token: input.refreshToken } })];
                    case 1:
                        stored = _a.sent();
                        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
                            throw (0, errors_1.unauthorized)('Refresh token đã bị thu hồi hoặc hết hạn');
                        }
                        return [4 /*yield*/, db_1.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, issueTokens(payload.sub, payload.role)];
                }
            });
        });
    },
    logout: function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!refreshToken)
                            return [2 /*return*/];
                        return [4 /*yield*/, db_1.prisma.refreshToken
                                .updateMany({
                                where: { token: refreshToken, revokedAt: null },
                                data: { revokedAt: new Date() },
                            })
                                .catch(function () { return undefined; })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    me: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw (0, errors_1.unauthorized)();
                        return [2 /*return*/, toPublicUser(user)];
                }
            });
        });
    },
    changePassword: function (userId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var user, ok, newHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { id: userId } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw (0, errors_1.unauthorized)();
                        return [4 /*yield*/, bcryptjs_1.default.compare(input.oldPassword, user.passwordHash)];
                    case 2:
                        ok = _a.sent();
                        if (!ok)
                            throw (0, errors_1.unauthorized)('Mật khẩu hiện tại không đúng');
                        return [4 /*yield*/, bcryptjs_1.default.hash(input.newPassword, 10)];
                    case 3:
                        newHash = _a.sent();
                        return [4 /*yield*/, db_1.prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db_1.prisma.refreshToken.updateMany({ where: { userId: userId, revokedAt: null }, data: { revokedAt: new Date() } })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    quenMatKhau: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resetToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: input.email } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        resetToken = (0, jwt_2.signResetToken)({ sub: user.id });
                        // Gửi email (nếu SMTP không cấu hình, hàm sẽ log vào console)
                        return [4 /*yield*/, (0, email_1.sendResetEmail)(user.email, resetToken).catch(function () { return undefined; })];
                    case 2:
                        // Gửi email (nếu SMTP không cấu hình, hàm sẽ log vào console)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    datLaiMatKhau: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, user, newHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            payload = (0, jwt_2.verifyResetToken)(input.token);
                        }
                        catch (_b) {
                            throw (0, errors_1.unauthorized)('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
                        }
                        return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { id: payload.sub } })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw (0, errors_1.unauthorized)('Người dùng không tồn tại');
                        return [4 /*yield*/, bcryptjs_1.default.hash(input.newPassword, 10)];
                    case 2:
                        newHash = _a.sent();
                        return [4 /*yield*/, db_1.prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } })];
                    case 3:
                        _a.sent();
                        // Revoke tất cả refresh tokens
                        return [4 /*yield*/, db_1.prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } })];
                    case 4:
                        // Revoke tất cả refresh tokens
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    // Dev helper: generate a reset token and send email preview without DB lookup
    devSendReset: function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user, sub, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: email } })];
                    case 1:
                        user = _a.sent();
                        sub = user ? user.id : 'dev-user';
                        token = (0, jwt_2.signResetToken)({ sub: sub });
                        return [4 /*yield*/, (0, email_1.sendResetEmail)(email, token).catch(function () { return undefined; })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { preview: true, token: token }];
                }
            });
        });
    },
};
