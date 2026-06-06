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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soatVeService = void 0;
var crypto_1 = require("crypto");
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var jwt_1 = require("@/utils/jwt");
function buildTicketFingerprint(input) {
    return crypto_1.default
        .createHash('sha256')
        .update([
        input.bookingId,
        input.userId,
        input.showtimeId,
        __spreadArray([], input.seatIds, true).sort().join(','),
        String(input.totalAmount),
    ].join('|'))
        .digest('hex');
}
function generateTicketToken(bookingId) {
    return __awaiter(this, void 0, void 0, function () {
        var booking, seatIds, fingerprint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.booking.findUnique({
                        where: { id: bookingId },
                        include: {
                            bookingSeats: {
                                select: {
                                    showtimeSeatId: true,
                                },
                            },
                        },
                    })];
                case 1:
                    booking = _a.sent();
                    if (!booking) {
                        throw (0, errors_1.badRequest)('Không tìm thấy đơn hàng để tạo mã vé.');
                    }
                    if (booking.status !== 'SUCCESS') {
                        throw (0, errors_1.conflict)('Chỉ có thể tạo mã vé khi đơn hàng đã thanh toán thành công.');
                    }
                    seatIds = booking.bookingSeats.map(function (item) { return item.showtimeSeatId; });
                    fingerprint = buildTicketFingerprint({
                        bookingId: booking.id,
                        userId: booking.userId,
                        showtimeId: booking.showtimeId,
                        seatIds: seatIds,
                        totalAmount: booking.totalAmount,
                    });
                    return [2 /*return*/, (0, jwt_1.signTicketToken)({
                            bookingId: booking.id,
                            userId: booking.userId,
                            showtimeId: booking.showtimeId,
                            seatIds: seatIds,
                            totalAmount: booking.totalAmount,
                            status: 'SUCCESS',
                            isCheckedIn: booking.isCheckedIn,
                            issuedAtMs: Date.now(),
                            fingerprint: fingerprint,
                            jti: crypto_1.default.randomUUID(),
                        })];
            }
        });
    });
}
exports.soatVeService = {
    generateTicketToken: generateTicketToken,
    scanTicket: function (staffId, token) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, bookingId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        payload = (0, jwt_1.verifyTicketToken)(token);
                    }
                    catch (_b) {
                        throw (0, errors_1.badRequest)('Mã vé không hợp lệ hoặc đã hết hạn.');
                    }
                    bookingId = payload.bookingId;
                    return [4 /*yield*/, db_1.prisma.$transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                            var booking, actualSeatIds, expectedFingerprint, hasSeatMismatch, updatedBooking;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.booking.findUnique({
                                            where: { id: bookingId },
                                            include: {
                                                bookingSeats: {
                                                    select: {
                                                        showtimeSeatId: true,
                                                    },
                                                },
                                            },
                                        })];
                                    case 1:
                                        booking = _a.sent();
                                        if (!booking) {
                                            throw (0, errors_1.badRequest)('Không tìm thấy đơn hàng này trong hệ thống.');
                                        }
                                        if (booking.status !== 'SUCCESS') {
                                            throw (0, errors_1.conflict)("\u0110\u01A1n h\u00E0ng ch\u01B0a thanh to\u00E1n ho\u1EB7c \u0111\u00E3 h\u1EE7y (Tr\u1EA1ng th\u00E1i: ".concat(booking.status, "). Kh\u00F4ng th\u1EC3 so\u00E1t v\u00E9."));
                                        }
                                        if (booking.isCheckedIn) {
                                            throw (0, errors_1.conflict)('Vé này đã được sử dụng qua cổng trước đó!');
                                        }
                                        actualSeatIds = booking.bookingSeats.map(function (item) { return item.showtimeSeatId; });
                                        expectedFingerprint = buildTicketFingerprint({
                                            bookingId: booking.id,
                                            userId: booking.userId,
                                            showtimeId: booking.showtimeId,
                                            seatIds: actualSeatIds,
                                            totalAmount: booking.totalAmount,
                                        });
                                        hasSeatMismatch = actualSeatIds.length !== payload.seatIds.length ||
                                            __spreadArray([], actualSeatIds, true).sort().join(',') !== __spreadArray([], payload.seatIds, true).sort().join(',');
                                        if (payload.userId !== booking.userId ||
                                            payload.showtimeId !== booking.showtimeId ||
                                            payload.totalAmount !== booking.totalAmount ||
                                            payload.status !== 'SUCCESS' ||
                                            payload.isCheckedIn !== false ||
                                            hasSeatMismatch ||
                                            payload.fingerprint !== expectedFingerprint) {
                                            throw (0, errors_1.badRequest)('Mã vé không hợp lệ hoặc đã bị thay đổi dữ liệu bảo mật.');
                                        }
                                        return [4 /*yield*/, tx.booking.update({
                                                where: { id: bookingId },
                                                data: { isCheckedIn: true },
                                            })];
                                    case 2:
                                        updatedBooking = _a.sent();
                                        return [4 /*yield*/, tx.staffLog.create({
                                                data: {
                                                    staffId: staffId,
                                                    bookingId: bookingId,
                                                    action: 'CHECK_IN',
                                                },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, updatedBooking];
                                }
                            });
                        }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
};
