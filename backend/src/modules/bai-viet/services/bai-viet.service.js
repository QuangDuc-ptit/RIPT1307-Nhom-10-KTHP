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
exports.postsService = void 0;
var slugify_1 = require("slugify");
var crypto_1 = require("crypto");
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var authorSelect = { id: true, name: true, avatar: true };
var toPublic = function (p) { return (__assign(__assign({}, p), { createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() })); };
/**
 * Tạo slug duy nhất từ title. Nếu trùng, thêm hậu tố random ngắn.
 */
var buildUniqueSlug = function (title, excludeId) { return __awaiter(void 0, void 0, void 0, function () {
    var base, slug, suffix, existing;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                base = (0, slugify_1.default)(title, { lower: true, strict: true, locale: 'vi' });
                slug = base;
                suffix = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.prisma.post.findUnique({ where: { slug: slug } })];
            case 2:
                existing = _a.sent();
                if (!existing || existing.id === excludeId)
                    return [2 /*return*/, slug];
                suffix += 1;
                slug = "".concat(base, "-").concat(suffix);
                if (suffix > 50) {
                    slug = "".concat(base, "-").concat(crypto_1.default.randomBytes(4).toString('hex'));
                    // Do not return here, let the loop continue to check the newly generated slug
                }
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.postsService = {
    /* ----- Public ----- */
    listPublic: function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, search, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, pageSize = params.pageSize, search = params.search;
                        where = __assign({ published: true }, (search
                            ? {
                                OR: [
                                    { title: { contains: search, mode: 'insensitive' } },
                                    { excerpt: { contains: search, mode: 'insensitive' } },
                                ],
                            }
                            : {}));
                        return [4 /*yield*/, db_1.prisma.$transaction([
                                db_1.prisma.post.findMany({
                                    where: where,
                                    include: { author: { select: authorSelect } },
                                    orderBy: { createdAt: 'desc' },
                                    skip: (page - 1) * pageSize,
                                    take: pageSize,
                                }),
                                db_1.prisma.post.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, { items: items.map(toPublic), total: total, page: page, pageSize: pageSize }];
                }
            });
        });
    },
    getBySlug: function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.post.findUnique({
                            where: { slug: slug },
                            include: { author: { select: authorSelect } },
                        })];
                    case 1:
                        post = _a.sent();
                        if (!post || !post.published)
                            throw (0, errors_1.notFound)('Không tìm thấy bài viết');
                        return [2 /*return*/, toPublic(post)];
                }
            });
        });
    },
    getById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.post.findUnique({
                            where: { id: id },
                            include: { author: { select: authorSelect } },
                        })];
                    case 1:
                        post = _a.sent();
                        if (!post || !post.published)
                            throw (0, errors_1.notFound)('Không tìm thấy bài viết');
                        return [2 /*return*/, toPublic(post)];
                }
            });
        });
    },
    /* ----- Admin ----- */
    listAdmin: function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, search, published, where, _a, items, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = params.page, pageSize = params.pageSize, search = params.search, published = params.published;
                        where = __assign(__assign({}, (typeof published === 'boolean' ? { published: published } : {})), (search
                            ? {
                                OR: [
                                    { title: { contains: search, mode: 'insensitive' } },
                                    { excerpt: { contains: search, mode: 'insensitive' } },
                                ],
                            }
                            : {}));
                        return [4 /*yield*/, db_1.prisma.$transaction([
                                db_1.prisma.post.findMany({
                                    where: where,
                                    include: { author: { select: authorSelect } },
                                    orderBy: { createdAt: 'desc' },
                                    skip: (page - 1) * pageSize,
                                    take: pageSize,
                                }),
                                db_1.prisma.post.count({ where: where }),
                            ])];
                    case 1:
                        _a = _b.sent(), items = _a[0], total = _a[1];
                        return [2 /*return*/, { items: items.map(toPublic), total: total, page: page, pageSize: pageSize }];
                }
            });
        });
    },
    detailAdmin: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.post.findUnique({
                            where: { id: id },
                            include: { author: { select: authorSelect } },
                        })];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            throw (0, errors_1.notFound)('Không tìm thấy bài viết');
                        return [2 /*return*/, toPublic(post)];
                }
            });
        });
    },
    create: function (authorId, input) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, buildUniqueSlug(input.title)];
                    case 1:
                        slug = _a.sent();
                        return [4 /*yield*/, db_1.prisma.post.create({
                                data: {
                                    title: input.title,
                                    slug: slug,
                                    content: input.content,
                                    excerpt: input.excerpt || null,
                                    coverImage: input.coverImage || null,
                                    published: !!input.published,
                                    authorId: authorId,
                                },
                                include: { author: { select: authorSelect } },
                            })];
                    case 2:
                        post = _a.sent();
                        return [2 /*return*/, toPublic(post)];
                }
            });
        });
    },
    update: function (id, input) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, data, _a, post;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.post.findUnique({ where: { id: id } })];
                    case 1:
                        existing = _b.sent();
                        if (!existing)
                            throw (0, errors_1.notFound)('Không tìm thấy bài viết');
                        data = {};
                        if (!(input.title !== undefined && input.title !== existing.title)) return [3 /*break*/, 3];
                        data.title = input.title;
                        _a = data;
                        return [4 /*yield*/, buildUniqueSlug(input.title, id)];
                    case 2:
                        _a.slug = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (input.content !== undefined)
                            data.content = input.content;
                        if (input.excerpt !== undefined)
                            data.excerpt = input.excerpt || null;
                        if (input.coverImage !== undefined)
                            data.coverImage = input.coverImage === '' ? null : input.coverImage;
                        if (input.published !== undefined)
                            data.published = input.published;
                        return [4 /*yield*/, db_1.prisma.post.update({
                                where: { id: id },
                                data: data,
                                include: { author: { select: authorSelect } },
                            })];
                    case 4:
                        post = _b.sent();
                        return [2 /*return*/, toPublic(post)];
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
                        return [4 /*yield*/, db_1.prisma.post.delete({ where: { id: id } })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        throw (0, errors_1.notFound)('Không tìm thấy bài viết');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
