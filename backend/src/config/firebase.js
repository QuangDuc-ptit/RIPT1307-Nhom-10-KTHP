"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
var firebase_admin_1 = require("firebase-admin");
exports.admin = firebase_admin_1.default;
var env_1 = require("./env");
if (!firebase_admin_1.default.apps.length) {
    try {
        if (env_1.env.FIREBASE_SERVICE_ACCOUNT) {
            var serviceAccount = JSON.parse(env_1.env.FIREBASE_SERVICE_ACCOUNT);
            firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(serviceAccount) });
        }
        else {
            firebase_admin_1.default.initializeApp();
        }
    }
    catch (e) {
        // If initialization fails, rethrow to make error visible during startup
        throw e;
    }
}
