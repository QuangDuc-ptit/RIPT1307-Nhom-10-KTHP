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
exports.suatChieuService = void 0;
var db_1 = require("@/config/db");
var errors_1 = require("@/utils/errors");
var SHOWTIME_BUFFER_MINUTES = 15;
var includeConfig = {
    movie: {
        include: {
            translations: true,
            genres: { include: { genre: true } },
        },
    },
    room: {
        include: {
            cinema: true,
            seats: true,
        },
    },
};
var toIso = function (value) { return (value ? value.toISOString() : null); };
var formatShowtime = function (showtime) {
    var _a;
    return ({
        id: showtime.id,
        movieId: showtime.movieId,
        roomId: showtime.roomId,
        startTime: showtime.startTime.toISOString(),
        endTime: calculateEndTime(showtime.startTime, (_a = showtime.movie) === null || _a === void 0 ? void 0 : _a.duration).toISOString(),
        createdAt: showtime.createdAt.toISOString(),
        updatedAt: showtime.updatedAt.toISOString(),
        movie: showtime.movie
            ? {
                id: showtime.movie.id,
                title: showtime.movie.title,
                poster: showtime.movie.poster,
                backdrop: showtime.movie.backdrop,
                overview: showtime.movie.overview,
                duration: showtime.movie.duration,
                releaseDate: toIso(showtime.movie.releaseDate),
                status: showtime.movie.status,
                isActive: showtime.movie.isActive,
                translations: showtime.movie.translations,
                genres: showtime.movie.genres.map(function (item) { return ({
                    id: item.genre.id,
                    name: item.genre.name,
                    slug: item.genre.slug,
                }); }),
            }
            : null,
        room: showtime.room
            ? {
                id: showtime.room.id,
                name: showtime.room.name,
                cinemaId: showtime.room.cinemaId,
                cinema: showtime.room.cinema,
                seats: showtime.room.seats,
            }
            : null,
    });
};
function calculateEndTime(startTime, duration) {
    var minutes = (duration !== null && duration !== void 0 ? duration : 0) + SHOWTIME_BUFFER_MINUTES;
    return new Date(startTime.getTime() + minutes * 60 * 1000);
}
function ensureMovieAndRoom(movieId, roomId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, movie, room;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        db_1.prisma.movie.findUnique({ where: { id: movieId } }),
                        db_1.prisma.room.findUnique({ where: { id: roomId }, include: { seats: true } }),
                    ])];
                case 1:
                    _a = _b.sent(), movie = _a[0], room = _a[1];
                    if (!movie)
                        throw (0, errors_1.notFound)('Không tìm thấy phim');
                    if (!room)
                        throw (0, errors_1.notFound)('Không tìm thấy phòng chiếu');
                    return [2 /*return*/, { movie: movie, room: room }];
            }
        });
    });
}
function ensureNoOverlap(params) {
    return __awaiter(this, void 0, void 0, function () {
        var roomId, movieDuration, startTime, excludeId, candidateEndTime, existingShowtimes, overlapped, existingEndTime;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    roomId = params.roomId, movieDuration = params.movieDuration, startTime = params.startTime, excludeId = params.excludeId;
                    candidateEndTime = calculateEndTime(startTime, movieDuration);
                    return [4 /*yield*/, db_1.prisma.showtime.findMany({
                            where: __assign({ roomId: roomId }, (excludeId ? { id: { not: excludeId } } : {})),
                            include: {
                                movie: {
                                    select: {
                                        title: true,
                                        duration: true,
                                    },
                                },
                            },
                            orderBy: { startTime: 'asc' },
                        })];
                case 1:
                    existingShowtimes = _d.sent();
                    overlapped = existingShowtimes.find(function (item) {
                        var _a;
                        var existingEndTime = calculateEndTime(item.startTime, (_a = item.movie) === null || _a === void 0 ? void 0 : _a.duration);
                        return startTime < existingEndTime && candidateEndTime > item.startTime;
                    });
                    if (overlapped) {
                        existingEndTime = calculateEndTime(overlapped.startTime, (_a = overlapped.movie) === null || _a === void 0 ? void 0 : _a.duration);
                        throw (0, errors_1.conflict)("Ph\u00F2ng chi\u1EBFu \u0111\u00E3 c\u00F3 l\u1ECBch t\u1EEB ".concat(overlapped.startTime.toISOString(), " \u0111\u1EBFn ").concat(existingEndTime.toISOString(), " cho phim ").concat((_c = (_b = overlapped.movie) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : 'khác'));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.suatChieuService = {
    list: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.showtime.findMany({
                            where: __assign(__assign(__assign({}, (filters.movieId ? { movieId: filters.movieId } : {})), (filters.roomId ? { roomId: filters.roomId } : {})), (filters.cinemaId ? { room: { cinemaId: filters.cinemaId } } : {})),
                            include: includeConfig,
                            orderBy: { startTime: 'asc' },
                        })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(formatShowtime)];
                }
            });
        });
    },
    detail: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var showtime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.showtime.findUnique({
                            where: { id: id },
                            include: __assign(__assign({}, includeConfig), { seats: {
                                    include: {
                                        seat: true,
                                        user: {
                                            select: { id: true, name: true, email: true },
                                        },
                                    },
                                    orderBy: [{ seat: { row: 'asc' } }, { seat: { number: 'asc' } }],
                                } }),
                        })];
                    case 1:
                        showtime = _a.sent();
                        if (!showtime)
                            throw (0, errors_1.notFound)('Không tìm thấy suất chiếu');
                        return [2 /*return*/, __assign(__assign({}, formatShowtime(showtime)), { seats: showtime.seats })];
                }
            });
        });
    },
    create: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, _a, movie, room, showtime;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startTime = new Date(data.startTime);
                        return [4 /*yield*/, ensureMovieAndRoom(data.movieId, data.roomId)];
                    case 1:
                        _a = _b.sent(), movie = _a.movie, room = _a.room;
                        return [4 /*yield*/, ensureNoOverlap({
                                roomId: data.roomId,
                                movieDuration: movie.duration,
                                startTime: startTime,
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, db_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var created;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.showtime.create({
                                                data: {
                                                    movieId: data.movieId,
                                                    roomId: data.roomId,
                                                    startTime: startTime,
                                                },
                                            })];
                                        case 1:
                                            created = _a.sent();
                                            if (!(room.seats.length > 0)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, tx.showtimeSeat.createMany({
                                                    data: room.seats.map(function (seat) { return ({
                                                        showtimeId: created.id,
                                                        seatId: seat.id,
                                                    }); }),
                                                })];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/, tx.showtime.findUnique({
                                                where: { id: created.id },
                                                include: includeConfig,
                                            })];
                                    }
                                });
                            }); })];
                    case 3:
                        showtime = _b.sent();
                        if (!showtime)
                            throw (0, errors_1.notFound)('Không tìm thấy suất chiếu');
                        return [2 /*return*/, formatShowtime(showtime)];
                }
            });
        });
    },
    update: function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, nextMovieId, nextRoomId, nextStartTime, _a, movie, room, shouldRegenerateSeats, showtime;
            var _this = this;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.showtime.findUnique({ where: { id: id } })];
                    case 1:
                        existing = _d.sent();
                        if (!existing)
                            throw (0, errors_1.notFound)('Không tìm thấy suất chiếu');
                        nextMovieId = (_b = data.movieId) !== null && _b !== void 0 ? _b : existing.movieId;
                        nextRoomId = (_c = data.roomId) !== null && _c !== void 0 ? _c : existing.roomId;
                        nextStartTime = data.startTime ? new Date(data.startTime) : existing.startTime;
                        return [4 /*yield*/, ensureMovieAndRoom(nextMovieId, nextRoomId)];
                    case 2:
                        _a = _d.sent(), movie = _a.movie, room = _a.room;
                        return [4 /*yield*/, ensureNoOverlap({
                                roomId: nextRoomId,
                                movieDuration: movie.duration,
                                startTime: nextStartTime,
                                excludeId: id,
                            })];
                    case 3:
                        _d.sent();
                        shouldRegenerateSeats = nextRoomId !== existing.roomId;
                        return [4 /*yield*/, db_1.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var updated;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.showtime.update({
                                                where: { id: id },
                                                data: {
                                                    movieId: nextMovieId,
                                                    roomId: nextRoomId,
                                                    startTime: nextStartTime,
                                                },
                                            })];
                                        case 1:
                                            updated = _a.sent();
                                            if (!shouldRegenerateSeats) return [3 /*break*/, 4];
                                            return [4 /*yield*/, tx.showtimeSeat.deleteMany({ where: { showtimeId: id } })];
                                        case 2:
                                            _a.sent();
                                            if (!(room.seats.length > 0)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, tx.showtimeSeat.createMany({
                                                    data: room.seats.map(function (seat) { return ({
                                                        showtimeId: updated.id,
                                                        seatId: seat.id,
                                                    }); }),
                                                })];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/, tx.showtime.findUnique({
                                                where: { id: updated.id },
                                                include: includeConfig,
                                            })];
                                    }
                                });
                            }); })];
                    case 4:
                        showtime = _d.sent();
                        if (!showtime)
                            throw (0, errors_1.notFound)('Không tìm thấy suất chiếu');
                        return [2 /*return*/, formatShowtime(showtime)];
                }
            });
        });
    },
    remove: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.prisma.showtime.findUnique({ where: { id: id } })];
                    case 1:
                        existing = _a.sent();
                        if (!existing)
                            throw (0, errors_1.notFound)('Không tìm thấy suất chiếu');
                        return [4 /*yield*/, db_1.prisma.showtime.delete({ where: { id: id } })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
};
