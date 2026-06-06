"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanTicketSchema = void 0;
var zod_1 = require("zod");
exports.scanTicketSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token soát vé không hợp lệ')
});
