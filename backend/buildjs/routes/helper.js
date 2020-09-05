"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.getId = (auth) => {
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = auth.substring(7);
        if (!token)
            return null;
        try {
            return jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN_KEY);
        }
        catch (err) {
            return null;
        }
    }
    return null;
};
