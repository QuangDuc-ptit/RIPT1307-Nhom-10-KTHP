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
exports.bookingService = void 0;
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var client_1 = require("@prisma/client");
exports.bookingService = {
    createBooking: function (userId, data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.$transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var seats, now, totalSeatAmount, bookingSeatsData, _i, seats_1, stSeat, price, totalFoodAmount, bookingFoodsData, foodIds, foodsDb, _loop_1, _a, _b, reqFood, totalAmount, booking;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, tx.showtimeSeat.findMany({
                                        where: {
                                            id: { in: data.showtimeSeatIds },
                                            showtimeId: data.showtimeId
                                        },
                                        include: { seat: true }
                                    })];
                                case 1:
                                    seats = _c.sent();
                                    if (seats.length !== data.showtimeSeatIds.length) {
                                        throw (0, errors_1.badRequest)('Một số ghế không hợp lệ hoặc không thuộc suất chiếu này');
                                    }
                                    now = new Date();
                                    totalSeatAmount = 0;
                                    bookingSeatsData = [];
                                    for (_i = 0, seats_1 = seats; _i < seats_1.length; _i++) {
                                        stSeat = seats_1[_i];
                                        // Kiểm tra chặt chẽ ghế có đúng là của user này giữ và chưa hết hạn không
                                        if (stSeat.status !== 'RESERVED' || stSeat.userId !== userId || (stSeat.expiresAt && stSeat.expiresAt < now)) {
                                            throw (0, errors_1.conflict)("Gh\u1EBF ".concat(stSeat.seat.row).concat(stSeat.seat.number, " ch\u01B0a \u0111\u01B0\u1EE3c gi\u1EEF ho\u1EB7c \u0111\u00E3 h\u1EBFt h\u1EA1n gi\u1EEF ch\u1ED7! Vui l\u00F2ng gi\u1EEF gh\u1EBF tr\u01B0\u1EDBc khi t\u1EA1o \u0111\u01A1n."));
                                        }
                                        price = 0;
                                        if (stSeat.seat.type === client_1.SeatType.NORMAL)
                                            price = 80000;
                                        else if (stSeat.seat.type === client_1.SeatType.VIP)
                                            price = 120000;
                                        else if (stSeat.seat.type === client_1.SeatType.SWEETBOX)
                                            price = 200000;
                                        totalSeatAmount += price;
                                        bookingSeatsData.push({
                                            showtimeSeatId: stSeat.id,
                                            price: price // Lưu cứng giá
                                        });
                                    }
                                    totalFoodAmount = 0;
                                    bookingFoodsData = [];
                                    if (!(data.foods.length > 0)) return [3 /*break*/, 3];
                                    foodIds = data.foods.map(function (f) { return f.foodId; });
                                    return [4 /*yield*/, tx.food.findMany({
                                            where: { id: { in: foodIds } }
                                        })];
                                case 2:
                                    foodsDb = _c.sent();
                                    if (foodsDb.length !== data.foods.length) {
                                        throw (0, errors_1.badRequest)('Một số đồ ăn không tồn tại trong hệ thống');
                                    }
                                    _loop_1 = function (reqFood) {
                                        var foodDb = foodsDb.find(function (f) { return f.id === reqFood.foodId; });
                                        if (foodDb) {
                                            var amount = foodDb.price * reqFood.quantity;
                                            totalFoodAmount += amount;
                                            bookingFoodsData.push({
                                                foodId: foodDb.id,
                                                quantity: reqFood.quantity,
                                                price: foodDb.price // Lưu cứng giá
                                            });
                                        }
                                    };
                                    for (_a = 0, _b = data.foods; _a < _b.length; _a++) {
                                        reqFood = _b[_a];
                                        _loop_1(reqFood);
                                    }
                                    _c.label = 3;
                                case 3:
                                    totalAmount = totalSeatAmount + totalFoodAmount;
                                    // 3. Gia hạn thời gian giữ ghế thêm 10 phút để người dùng thanh toán
                                    return [4 /*yield*/, tx.showtimeSeat.updateMany({
                                            where: { id: { in: data.showtimeSeatIds } },
                                            data: {
                                                expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                                            }
                                        })];
                                case 4:
                                    // 3. Gia hạn thời gian giữ ghế thêm 10 phút để người dùng thanh toán
                                    _c.sent();
                                    return [4 /*yield*/, tx.booking.create({
                                            data: {
                                                userId: userId,
                                                showtimeId: data.showtimeId,
                                                totalAmount: totalAmount,
                                                status: 'PENDING',
                                                bookingSeats: {
                                                    create: bookingSeatsData
                                                },
                                                bookingFoods: {
                                                    create: bookingFoodsData
                                                }
                                            },
                                            include: {
                                                bookingSeats: true,
                                                bookingFoods: true
                                            }
                                        })];
                                case 5:
                                    booking = _c.sent();
                                    return [2 /*return*/, booking];
                            }
                        });
                    }); })];
                case 1: 
                // Sử dụng Transaction để đảm bảo tính toàn vẹn (ACID)
                return [2 /*return*/, _a.sent()];
            }
        });
    }); }
};
