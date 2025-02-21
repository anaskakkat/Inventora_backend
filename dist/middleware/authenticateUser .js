"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    try {
        // console.log("Cookies from Request:-----------------", req.cookies);
        const token = req.cookies.token;
        // console.log("Token from middleware:===========", token);
        if (!token) {
            res.status(401).json({ message: " No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        // console.log("decoded---", decoded);
        req.userId = decoded.id; // Attach userId to request
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.authenticateUser = authenticateUser;
