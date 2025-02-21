"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const saleRoutes_1 = __importDefault(require("./routes/saleRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
app.get("/", (req, res) => {
    res.send("Server Running");
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/items", itemRoutes_1.default);
app.use("/api/customer", customerRoutes_1.default);
app.use("/api/sale", saleRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
