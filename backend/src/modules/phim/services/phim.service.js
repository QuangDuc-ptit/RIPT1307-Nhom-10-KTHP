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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phimService = void 0;
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var toPublic = function (p) { return (__assign(__assign({}, p), { createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() })); };
exports.phimService = {
    /* ----- Public: client xem danh sách phim ----- */
    listPublic: function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, search, locale, status, genreId, isActive, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, pageSize = params.pageSize, search = params.search, locale = params.locale, status = params.status, genreId = params.genreId, isActive = params.isActive;
                        where = __assign(__assign(__assign({ isActive: isActive !== undefined ? isActive : true }, (status ? { status: status } : { status: 'PUBLISHED' })), (search
                            ? {
                                translations: {
                                    some: {
                                        locale: locale,
                                        title: { contains: search, mode: 'insensitive' },
                                    },
                                },
                            }
                            : {})), (genreId
                            ? {
                                genres: {
                                    some: { genreId: genreId },
                                },
                            }
                            : {}));
                        return [4 /*yield*/, db_1.prisma.$transaction([
                                db_1.prisma.movie.findMany({
                                    where: where,
                                    include: {
                                        translations: { where: { locale: locale } },
                                        genres: { include: { genre: true } },
                                    },
                                    orderBy: { releaseDate: 'desc' },
                                    skip: (page - 1) * pageSize,
                                    take: pageSize,
                                }),
                                db_1.prisma.movie.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                items: items.map(function (m) {
                                    var _a, _b, _c, _d;
                                    var t = m.translations[0];
                                    return {
                                        id: m.id,
                                        title: (_a = t === null || t === void 0 ? void 0 : t.title) !== null && _a !== void 0 ? _a : m.title,
                                        overview: (_b = t === null || t === void 0 ? void 0 : t.overview) !== null && _b !== void 0 ? _b : m.overview,
                                        poster: m.poster,
                                        backdrop: m.backdrop,
                                        duration: m.duration,
                                        releaseDate: (_d = (_c = m.releaseDate) === null || _c === void 0 ? void 0 : _c.toISOString()) !== null && _d !== void 0 ? _d : null,
                                        status: m.status,
                                        isActive: m.isActive,
                                        genres: m.genres.map(function (g) { return ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug }); }),
                                        createdAt: m.createdAt.toISOString(),
                                        updatedAt: m.updatedAt.toISOString(),
                                    };
                                }),
                                total: total,
                                page: page,
                                pageSize: pageSize,
                            }];
                }
            });
        });
    },
    getById: function (id_1) {
        return __awaiter(this, arguments, void 0, function (id, locale) {
            var movie, t;
            var _a, _b, _c, _d;
            if (locale === void 0) { locale = 'vi'; }
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.movie.findUnique({
                            where: { id: id },
                            include: {
                                translations: true,
                                genres: { include: { genre: true } },
                            },
                        })];
                    case 1:
                        movie = _e.sent();
                        if (!movie || !movie.isActive)
                            throw (0, errors_1.notFound)('Không tìm thấy phim');
                        t = movie.translations.find(function (tr) { return tr.locale === locale; });
                        return [2 /*return*/, {
                                id: movie.id,
                                title: (_a = t === null || t === void 0 ? void 0 : t.title) !== null && _a !== void 0 ? _a : movie.title,
                                overview: (_b = t === null || t === void 0 ? void 0 : t.overview) !== null && _b !== void 0 ? _b : movie.overview,
                                poster: movie.poster,
                                backdrop: movie.backdrop,
                                duration: movie.duration,
                                releaseDate: (_d = (_c = movie.releaseDate) === null || _c === void 0 ? void 0 : _c.toISOString()) !== null && _d !== void 0 ? _d : null,
                                status: movie.status,
                                isActive: movie.isActive,
                                translations: movie.translations,
                                genres: movie.genres.map(function (g) { return ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug }); }),
                                createdAt: movie.createdAt.toISOString(),
                                updatedAt: movie.updatedAt.toISOString(),
                            }];
                }
            });
        });
    },
    /* ----- Admin ----- */
    listAdmin: function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, search, locale, status, genreId, isActive, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, pageSize = params.pageSize, search = params.search, locale = params.locale, status = params.status, genreId = params.genreId, isActive = params.isActive;
                        where = __assign(__assign(__assign(__assign({}, (status ? { status: status } : {})), (isActive !== undefined ? { isActive: isActive } : {})), (search
                            ? {
                                OR: [
                                    { title: { contains: search, mode: 'insensitive' } },
                                    { translations: { some: { locale: locale, title: { contains: search, mode: 'insensitive' } } } },
                                ],
                            }
                            : {})), (genreId ? { genres: { some: { genreId: genreId } } } : {}));
                        return [4 /*yield*/, db_1.prisma.$transaction([
                                db_1.prisma.movie.findMany({
                                    where: where,
                                    include: {
                                        translations: true,
                                        genres: { include: { genre: true } },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    skip: (page - 1) * pageSize,
                                    take: pageSize,
                                }),
                                db_1.prisma.movie.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                items: items.map(function (m) {
                                    var _a, _b, _c, _d;
                                    var t = m.translations.find(function (tr) { return tr.locale === locale; });
                                    return {
                                        id: m.id,
                                        title: (_a = t === null || t === void 0 ? void 0 : t.title) !== null && _a !== void 0 ? _a : m.title,
                                        overview: (_b = t === null || t === void 0 ? void 0 : t.overview) !== null && _b !== void 0 ? _b : m.overview,
                                        poster: m.poster,
                                        backdrop: m.backdrop,
                                        duration: m.duration,
                                        releaseDate: (_d = (_c = m.releaseDate) === null || _c === void 0 ? void 0 : _c.toISOString()) !== null && _d !== void 0 ? _d : null,
                                        status: m.status,
                                        isActive: m.isActive,
                                        translations: m.translations,
                                        genres: m.genres.map(function (g) { return ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug }); }),
                                        createdAt: m.createdAt.toISOString(),
                                        updatedAt: m.updatedAt.toISOString(),
                                    };
                                }),
                                total: total,
                                page: page,
                                pageSize: pageSize,
                            }];
                }
            });
        });
    },
    detailAdmin: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getById(id, 'vi')];
            });
        });
    },
    create: function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var translations, genreIds, releaseDate, rest, movie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        translations = input.translations, genreIds = input.genreIds, releaseDate = input.releaseDate, rest = __rest(input, ["translations", "genreIds", "releaseDate"]);
                        return [4 /*yield*/, db_1.prisma.movie.create({
                                data: __assign(__assign(__assign({}, rest), (releaseDate ? { releaseDate: new Date(releaseDate) } : {})), { translations: {
                                        create: translations.map(function (t) {
                                            var _a;
                                            return ({
                                                locale: t.locale,
                                                title: t.title,
                                                overview: (_a = t.overview) !== null && _a !== void 0 ? _a : null,
                                            });
                                        }),
                                    }, genres: (genreIds === null || genreIds === void 0 ? void 0 : genreIds.length)
                                        ? {
                                            create: genreIds.map(function (genreId) { return ({ genreId: genreId }); }),
                                        }
                                        : undefined }),
                                include: {
                                    translations: true,
                                    genres: { include: { genre: true } },
                                },
                            })];
                    case 1:
                        movie = _a.sent();
                        return [2 /*return*/, toPublic(movie)];
                }
            });
        });
    },
    update: function (id, input) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, translations, genreIds, releaseDate, rest, data, movie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.movie.findUnique({ where: { id: id } })];
                    case 1:
                        existing = _a.sent();
                        if (!existing)
                            throw (0, errors_1.notFound)('Không tìm thấy phim');
                        translations = input.translations, genreIds = input.genreIds, releaseDate = input.releaseDate, rest = __rest(input, ["translations", "genreIds", "releaseDate"]);
                        data = __assign({}, rest);
                        if (releaseDate !== undefined)
                            data.releaseDate = releaseDate ? new Date(releaseDate) : null;
                        return [4 /*yield*/, db_1.prisma.movie.update({
                                where: { id: id },
                                data: __assign(__assign(__assign({}, data), (translations
                                    ? {
                                        translations: {
                                            upsert: translations.map(function (t) {
                                                var _a, _b;
                                                return ({
                                                    where: { movieId_locale: { movieId: id, locale: t.locale } },
                                                    create: { locale: t.locale, title: t.title, overview: (_a = t.overview) !== null && _a !== void 0 ? _a : null },
                                                    update: { title: t.title, overview: (_b = t.overview) !== null && _b !== void 0 ? _b : null },
                                                });
                                            }),
                                        },
                                    }
                                    : {})), (genreIds !== undefined
                                    ? {
                                        genres: __assign({ deleteMany: {} }, (genreIds.length > 0
                                            ? {
                                                create: genreIds.map(function (genreId) { return ({ genreId: genreId }); }),
                                            }
                                            : {})),
                                    }
                                    : {})),
                                include: {
                                    translations: true,
                                    genres: { include: { genre: true } },
                                },
                            })];
                    case 2:
                        movie = _a.sent();
                        return [2 /*return*/, toPublic(movie)];
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
                        return [4 /*yield*/, db_1.prisma.movie.delete({ where: { id: id } })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        throw (0, errors_1.notFound)('Không tìm thấy phim');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
