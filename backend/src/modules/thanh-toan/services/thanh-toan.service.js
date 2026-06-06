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
exports.thanhToanService = void 0;
var crypto_1 = require("crypto");
var db_1 = require("@/config/db");
var env_1 = require("@/config/env");
var errors_1 = require("@/utils/errors");
var soat_ve_service_1 = require("@/modules/soat-ve/services/soat-ve.service");
var PAYMENT_HOLD_MINUTES = 10;
function generateRequestId(provider) {
    return "".concat(provider, "_").concat(Date.now(), "_").concat(crypto_1.default.randomBytes(4).toString('hex'));
}
function buildInvoiceNumber() {
    return "INV-".concat(Date.now(), "-").concat(crypto_1.default.randomBytes(3).toString('hex').toUpperCase());
}
function normalizeProviderSuccess(provider, payload) {
    if (typeof payload.success === 'boolean')
        return payload.success;
    if (provider === 'VNPAY')
        return payload.responseCode === '00';
    return payload.resultCode === '0' || payload.responseCode === '0';
}
function buildPaymentUrl(provider, requestId, bookingId, amount) {
    var returnUrl = new URL(env_1.env.PAYMENT_RETURN_URL);
    returnUrl.searchParams.set('provider', provider);
    returnUrl.searchParams.set('requestId', requestId);
    returnUrl.searchParams.set('bookingId', bookingId);
    if (provider === 'VNPAY') {
        var url_1 = new URL(env_1.env.VNPAY_BASE_URL);
        url_1.searchParams.set('vnp_TxnRef', requestId);
        url_1.searchParams.set('vnp_Amount', String(Math.round(amount * 100)));
        url_1.searchParams.set('vnp_OrderInfo', "Thanh toan don ".concat(bookingId));
        url_1.searchParams.set('vnp_ReturnUrl', returnUrl.toString());
        if (env_1.env.VNPAY_TMN_CODE)
            url_1.searchParams.set('vnp_TmnCode', env_1.env.VNPAY_TMN_CODE);
        return url_1.toString();
    }
    var url = new URL(env_1.env.PAYMENT_RETURN_URL);
    url.searchParams.set('provider', provider);
    url.searchParams.set('requestId', requestId);
    url.searchParams.set('bookingId', bookingId);
    url.searchParams.set('momoAmount', String(amount));
    return url.toString();
}
exports.thanhToanService = {
    createPayment: function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var booking, now, invalidSeat, requestId, paymentUrl, expiresAt, payment;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.booking.findUnique({
                            where: { id: data.bookingId },
                            include: {
                                bookingSeats: {
                                    include: {
                                        showtimeSeat: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        booking = _a.sent();
                        if (!booking || booking.userId !== userId) {
                            throw (0, errors_1.notFound)('Không tìm thấy đơn hàng');
                        }
                        if (booking.status !== 'PENDING') {
                            throw (0, errors_1.conflict)('Đơn hàng không ở trạng thái chờ thanh toán');
                        }
                        now = new Date();
                        invalidSeat = booking.bookingSeats.find(function (item) {
                            return item.showtimeSeat.status !== 'RESERVED' ||
                                item.showtimeSeat.userId !== userId ||
                                (item.showtimeSeat.expiresAt ? item.showtimeSeat.expiresAt < now : true);
                        });
                        if (invalidSeat) {
                            throw (0, errors_1.conflict)('Đơn hàng có ghế không còn được giữ hợp lệ để thanh toán');
                        }
                        requestId = generateRequestId(data.provider);
                        paymentUrl = buildPaymentUrl(data.provider, requestId, booking.id, booking.totalAmount);
                        expiresAt = new Date(Date.now() + PAYMENT_HOLD_MINUTES * 60 * 1000);
                        return [4 /*yield*/, db_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.showtimeSeat.updateMany({
                                                where: { id: { in: booking.bookingSeats.map(function (item) { return item.showtimeSeatId; }) } },
                                                data: { expiresAt: expiresAt },
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, tx.payment.create({
                                                    data: {
                                                        bookingId: booking.id,
                                                        provider: data.provider,
                                                        amount: booking.totalAmount,
                                                        requestId: requestId,
                                                        paymentUrl: paymentUrl,
                                                        redirectPayload: {
                                                            bookingId: booking.id,
                                                            provider: data.provider,
                                                            amount: booking.totalAmount,
                                                            returnUrl: env_1.env.PAYMENT_RETURN_URL,
                                                            ipnUrl: env_1.env.PAYMENT_IPN_URL,
                                                        },
                                                    },
                                                })];
                                    }
                                });
                            }); })];
                    case 2:
                        payment = _a.sent();
                        return [2 /*return*/, {
                                message: 'Khởi tạo thanh toán thành công',
                                payment: {
                                    id: payment.id,
                                    bookingId: payment.bookingId,
                                    provider: payment.provider,
                                    status: payment.status,
                                    amount: payment.amount,
                                    requestId: payment.requestId,
                                    paymentUrl: payment.paymentUrl,
                                    redirectPayload: payment.redirectPayload,
                                    createdAt: payment.createdAt.toISOString(),
                                },
                            }];
                }
            });
        });
    },
    handleIpn: function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var payment, isSuccess, failed, result, ticketToken;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.payment.findUnique({
                            where: { requestId: payload.requestId },
                            include: {
                                booking: {
                                    include: {
                                        bookingSeats: true,
                                        bookingFoods: true,
                                    },
                                },
                                invoice: true,
                            },
                        })];
                    case 1:
                        payment = _e.sent();
                        if (!payment || payment.provider !== payload.provider) {
                            throw (0, errors_1.notFound)('Không tìm thấy giao dịch thanh toán');
                        }
                        if (payment.status === 'SUCCESS') {
                            return [2 /*return*/, {
                                    message: 'Giao dịch đã được xử lý trước đó',
                                    bookingId: payment.bookingId,
                                    paymentId: payment.id,
                                    invoiceId: (_b = (_a = payment.invoice) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                                }];
                        }
                        isSuccess = normalizeProviderSuccess(payload.provider, payload);
                        if (payload.amount !== undefined && Math.round(payload.amount) !== Math.round(payment.amount)) {
                            throw (0, errors_1.badRequest)('Số tiền thanh toán không khớp');
                        }
                        if (!!isSuccess) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.prisma.payment.update({
                                where: { id: payment.id },
                                data: {
                                    status: 'FAILED',
                                    providerRef: payload.providerRef,
                                    responseCode: (_d = (_c = payload.responseCode) !== null && _c !== void 0 ? _c : payload.resultCode) !== null && _d !== void 0 ? _d : null,
                                },
                            })];
                    case 2:
                        failed = _e.sent();
                        return [2 /*return*/, {
                                message: 'Giao dịch thanh toán thất bại',
                                paymentId: failed.id,
                                bookingId: failed.bookingId,
                                status: failed.status,
                            }];
                    case 3: return [4 /*yield*/, db_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var updatedPayment, updatedBooking, invoice, _a;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, tx.payment.update({
                                            where: { id: payment.id },
                                            data: {
                                                status: 'SUCCESS',
                                                providerRef: payload.providerRef,
                                                responseCode: (_c = (_b = payload.responseCode) !== null && _b !== void 0 ? _b : payload.resultCode) !== null && _c !== void 0 ? _c : 'SUCCESS',
                                                paidAt: new Date(),
                                            },
                                        })];
                                    case 1:
                                        updatedPayment = _d.sent();
                                        return [4 /*yield*/, tx.booking.update({
                                                where: { id: payment.bookingId },
                                                data: { status: 'SUCCESS' },
                                            })];
                                    case 2:
                                        updatedBooking = _d.sent();
                                        return [4 /*yield*/, tx.showtimeSeat.updateMany({
                                                where: { id: { in: payment.booking.bookingSeats.map(function (item) { return item.showtimeSeatId; }) } },
                                                data: {
                                                    status: 'BOOKED',
                                                    expiresAt: null,
                                                },
                                            })];
                                    case 3:
                                        _d.sent();
                                        if (!payment.invoice) return [3 /*break*/, 4];
                                        _a = payment.invoice;
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, tx.invoice.create({
                                            data: {
                                                bookingId: payment.bookingId,
                                                paymentId: updatedPayment.id,
                                                invoiceNumber: buildInvoiceNumber(),
                                                amount: updatedPayment.amount,
                                                issuedAt: new Date(),
                                            },
                                        })];
                                    case 5:
                                        _a = _d.sent();
                                        _d.label = 6;
                                    case 6:
                                        invoice = _a;
                                        return [2 /*return*/, { updatedPayment: updatedPayment, updatedBooking: updatedBooking, invoice: invoice }];
                                }
                            });
                        }); })];
                    case 4:
                        result = _e.sent();
                        return [4 /*yield*/, soat_ve_service_1.soatVeService.generateTicketToken(result.updatedBooking.id)];
                    case 5:
                        ticketToken = _e.sent();
                        return [2 /*return*/, {
                                message: 'Xử lý IPN thành công',
                                booking: {
                                    id: result.updatedBooking.id,
                                    status: result.updatedBooking.status,
                                    ticketToken: ticketToken,
                                },
                                payment: {
                                    id: result.updatedPayment.id,
                                    status: result.updatedPayment.status,
                                    providerRef: result.updatedPayment.providerRef,
                                },
                                invoice: {
                                    id: result.invoice.id,
                                    invoiceNumber: result.invoice.invoiceNumber,
                                    amount: result.invoice.amount,
                                    issuedAt: result.invoice.issuedAt.toISOString(),
                                },
                            }];
                }
            });
        });
    },
};
