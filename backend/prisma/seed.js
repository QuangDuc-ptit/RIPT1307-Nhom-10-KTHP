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
require("dotenv/config");
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var slugify_1 = require("slugify");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPasswordHash, userPasswordHash, admin, user, samplePosts, _i, samplePosts_1, p, slug;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    return [4 /*yield*/, bcryptjs_1.default.hash('admin123', 10)];
                case 1:
                    adminPasswordHash = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('user123', 10)];
                case 2:
                    userPasswordHash = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@example.com' },
                            update: {},
                            create: {
                                email: 'admin@example.com',
                                passwordHash: adminPasswordHash,
                                name: 'Admin',
                                role: client_1.Role.ADMIN,
                            },
                        })];
                case 3:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'user@example.com' },
                            update: {},
                            create: {
                                email: 'user@example.com',
                                passwordHash: userPasswordHash,
                                name: 'Người dùng mẫu',
                                role: client_1.Role.USER,
                            },
                        })];
                case 4:
                    user = _a.sent();
                    console.log('✓ Users:', admin.email, user.email);
                    samplePosts = [
                        {
                            title: 'Chào mừng đến với Base Web',
                            content: 'Đây là bài viết mẫu đầu tiên. Bạn có thể chỉnh sửa hoặc xoá nó từ trang admin.\n\nBase Web được thiết kế để giúp bạn khởi động dự án thật nhanh.',
                            excerpt: 'Bài viết chào mừng người dùng mới của Base Web.',
                            published: true,
                        },
                        {
                            title: 'Hướng dẫn cài đặt dự án',
                            content: 'Bước 1: clone repo.\nBước 2: cài deps.\nBước 3: chạy `npm run dev`.\nBước 4: mở trình duyệt.',
                            excerpt: 'Cách bắt đầu dự án trong 4 bước.',
                            published: true,
                        },
                        {
                            title: 'Bài viết nháp (chưa xuất bản)',
                            content: 'Bài này chưa public, sẽ không hiện ở trang client.',
                            excerpt: '',
                            published: false,
                        },
                    ];
                    _i = 0, samplePosts_1 = samplePosts;
                    _a.label = 5;
                case 5:
                    if (!(_i < samplePosts_1.length)) return [3 /*break*/, 8];
                    p = samplePosts_1[_i];
                    slug = (0, slugify_1.default)(p.title, { lower: true, strict: true, locale: 'vi' });
                    return [4 /*yield*/, prisma.post.upsert({
                            where: { slug: slug },
                            update: {},
                            create: __assign(__assign({}, p), { slug: slug, authorId: admin.id }),
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log('✓ Posts seeded');
                    console.log('\nĐăng nhập với:');
                    console.log('  admin@example.com / admin123  (ADMIN)');
                    console.log('  user@example.com  / user123   (USER)\n');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
