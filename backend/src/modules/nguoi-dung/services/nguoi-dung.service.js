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
exports.usersService = void 0;
var bcryptjs_1 = require("bcryptjs");
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var publicSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    avatar: true,
    createdAt: true,
};
var toPublic = function (u) { return (__assign(__assign({}, u), { createdAt: u.createdAt.toISOString() })); };
exports.usersService = {
    /**
     * Update profile của chính user đang đăng nhập.
     */
    updateMe: function (userId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: __assign(__assign({}, (input.name !== undefined ? { name: input.name } : {})), (input.avatar !== undefined
                                ? { avatar: input.avatar === '' ? null : input.avatar }
                                : {})),
                            select: publicSelect,
                        })];
                    case 1:
                        updated = _a.sent();
                        return [2 /*return*/, toPublic(updated)];
                }
            });
        });
    },
    /* ---------- Admin endpoints ---------- */
    list: function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, search, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, pageSize = params.pageSize, search = params.search;
                        where = search
                            ? {
                                OR: [
                                    { email: { contains: search, mode: 'insensitive' } },
                                    { name: { contains: search, mode: 'insensitive' } },
                                ],
                            }
                            : undefined;
                        return [4 /*yield*/, db_1.prisma.$transaction([
                                db_1.prisma.user.findMany({
                                    where: where,
                                    select: publicSelect,
                                    orderBy: { createdAt: 'desc' },
                                    skip: (page - 1) * pageSize,
                                    take: pageSize,
                                }),
                                db_1.prisma.user.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, { items: items.map(toPublic), total: total, page: page, pageSize: pageSize }];
                }
            });
        });
    },
    detail: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { id: id }, select: publicSelect })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw (0, errors_1.notFound)('Không tìm thấy người dùng');
                        return [2 /*return*/, toPublic(user)];
                }
            });
        });
    },
    create: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, passwordHash, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: input.email } })];
                    case 1:
                        existing = _a.sent();
                        if (existing)
                            throw (0, errors_1.conflict)('Email đã tồn tại');
                        return [4 /*yield*/, bcryptjs_1.default.hash(input.password, 10)];
                    case 2:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, db_1.prisma.user.create({
                                data: {
                                    email: input.email,
                                    name: input.name,
                                    passwordHash: passwordHash,
                                    role: input.role,
                                },
                                select: publicSelect,
                            })];
                    case 3:
                        user = _a.sent();
                        return [2 /*return*/, toPublic(user)];
                }
            });
        });
    },
    update: function (id, input) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, user, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        data = {};
                        if (input.name !== undefined)
                            data.name = input.name;
                        if (input.role !== undefined)
                            data.role = input.role;
                        if (!input.password) return [3 /*break*/, 3];
                        _a = data;
                        return [4 /*yield*/, bcryptjs_1.default.hash(input.password, 10)];
                    case 1:
                        _a.passwordHash = _c.sent();
                        return [4 /*yield*/, db_1.prisma.refreshToken.updateMany({
                                where: { userId: id, revokedAt: null },
                                data: { revokedAt: new Date() },
                            })];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, db_1.prisma.user.update({ where: { id: id }, data: data, select: publicSelect })];
                    case 4:
                        user = _c.sent();
                        return [2 /*return*/, toPublic(user)];
                    case 5:
                        _b = _c.sent();
                        throw (0, errors_1.notFound)('Không tìm thấy người dùng');
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    remove: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.prisma.user.delete({ where: { id: id } })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        throw (0, errors_1.notFound)('Không tìm thấy người dùng');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
