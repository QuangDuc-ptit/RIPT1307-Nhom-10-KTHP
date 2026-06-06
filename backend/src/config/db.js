"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var env_1 = require("./env");
exports.prisma = (_a = global.__prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: env_1.env.isProd ? ['error'] : ['warn', 'error'],
});
if (!env_1.env.isProd)
    global.__prisma = exports.prisma;
