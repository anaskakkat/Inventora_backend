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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email } = req.body;
    console.log("-----body----", req.body);
    try {
        const existingEmail = yield User_1.default.findOne({ email });
        if (existingEmail) {
            // console.log("-----existingEmail----");
            res.status(400).json({ message: "Email Already Registered" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ name, email, password: hashedPassword });
        // console.log("-----newUser----", newUser);
        yield newUser.save();
        res.status(200).json({ message: "User registered" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // console.log("-----body----", req.body);
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "User Login Succesfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.login = login;
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("--signout---body----");
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Successfully logged out" });
    }
    catch (error) {
        console.error("Error in Signout:", error);
        res.status(500).json({ message: "Error in Signout" });
    }
});
exports.signout = signout;
