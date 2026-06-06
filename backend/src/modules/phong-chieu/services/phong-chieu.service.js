"use strict";
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
exports.phongChieuService = void 0;
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var client_1 = require("@prisma/client");
exports.phongChieuService = {
    list: function (cinemaId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.prisma.room.findMany({
                    where: cinemaId ? { cinemaId: cinemaId } : undefined,
                    include: { cinema: true },
                    orderBy: { createdAt: 'desc' },
                })];
        });
    }); },
    detail: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.room.findUnique({
                        where: { id: id },
                        include: { cinema: true, seats: true },
                    })];
                case 1:
                    room = _a.sent();
                    if (!room)
                        throw (0, errors_1.notFound)('Không tìm thấy phòng chiếu');
                    return [2 /*return*/, room];
            }
        });
    }); },
    create: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var cinema, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.cinema.findUnique({ where: { id: data.cinemaId } })];
                case 1:
                    cinema = _a.sent();
                    if (!cinema)
                        throw (0, errors_1.notFound)('Không tìm thấy rạp chiếu');
                    return [4 /*yield*/, db_1.prisma.room.findFirst({
                            where: { name: data.name, cinemaId: data.cinemaId }
                        })];
                case 2:
                    existing = _a.sent();
                    if (existing)
                        throw (0, errors_1.conflict)('Tên phòng chiếu đã tồn tại trong rạp này');
                    return [2 /*return*/, db_1.prisma.room.create({ data: data })];
            }
        });
    }); },
    update: function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var room, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.room.findUnique({ where: { id: id } })];
                case 1:
                    room = _a.sent();
                    if (!room)
                        throw (0, errors_1.notFound)('Không tìm thấy phòng chiếu');
                    return [4 /*yield*/, db_1.prisma.room.findFirst({
                            where: { name: data.name, cinemaId: room.cinemaId, id: { not: id } }
                        })];
                case 2:
                    existing = _a.sent();
                    if (existing)
                        throw (0, errors_1.conflict)('Tên phòng chiếu đã tồn tại trong rạp này');
                    return [2 /*return*/, db_1.prisma.room.update({ where: { id: id }, data: data })];
            }
        });
    }); },
    remove: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.room.findUnique({ where: { id: id } })];
                case 1:
                    existing = _a.sent();
                    if (!existing)
                        throw (0, errors_1.notFound)('Không tìm thấy phòng chiếu');
                    return [2 /*return*/, db_1.prisma.room.delete({ where: { id: id } })];
            }
        });
    }); },
    generateSeats: function (roomId, config) { return __awaiter(void 0, void 0, void 0, function () {
        var room, rowCount, seatsPerRow, _a, vipRows, _b, sweetboxRows, newSeats, i, rowChar, type, number;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db_1.prisma.room.findUnique({ where: { id: roomId } })];
                case 1:
                    room = _c.sent();
                    if (!room)
                        throw (0, errors_1.notFound)('Không tìm thấy phòng chiếu');
                    rowCount = config.rowCount, seatsPerRow = config.seatsPerRow, _a = config.vipRows, vipRows = _a === void 0 ? [] : _a, _b = config.sweetboxRows, sweetboxRows = _b === void 0 ? [] : _b;
                    // Delete existing seats
                    return [4 /*yield*/, db_1.prisma.seat.deleteMany({ where: { roomId: roomId } })];
                case 2:
                    // Delete existing seats
                    _c.sent();
                    newSeats = [];
                    // rowCount 1-26 mapped to A-Z
                    for (i = 0; i < rowCount; i++) {
                        rowChar = String.fromCharCode(65 + i);
                        type = client_1.SeatType.NORMAL;
                        if (vipRows.includes(rowChar))
                            type = client_1.SeatType.VIP;
                        if (sweetboxRows.includes(rowChar))
                            type = client_1.SeatType.SWEETBOX;
                        for (number = 1; number <= seatsPerRow; number++) {
                            newSeats.push({
                                roomId: roomId,
                                row: rowChar,
                                number: number,
                                type: type
                            });
                        }
                    }
                    return [4 /*yield*/, db_1.prisma.seat.createMany({ data: newSeats })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, { success: true, count: newSeats.length }];
            }
        });
    }); }
};
