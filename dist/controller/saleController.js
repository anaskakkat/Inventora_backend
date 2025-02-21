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
exports.dashboardData = exports.fetchSales = exports.createSale = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const Items_1 = __importDefault(require("../models/Items"));
const Customers_1 = __importDefault(require("../models/Customers"));
const mongoose_1 = __importDefault(require("mongoose"));
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("--createSale---body----", req.body);
    const generateReceiptNumber = () => __awaiter(void 0, void 0, void 0, function* () {
        return Math.floor(10000 + Math.random() * 90000).toString();
    });
    const { date, customerId, totalAmount, items } = req.body;
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        // Check stock availability
        for (const item of items) {
            const itemInStock = yield Items_1.default.findById(item._id);
            if (!itemInStock || itemInStock.quantity < item.quantity) {
                res.status(400).json({
                    message: `Insufficient stock for item ${item.itemId}`,
                });
                return;
            }
        }
        const receiptNumber = yield generateReceiptNumber();
        // Create a new sale
        const newSale = new Sale_1.default({
            userId,
            date,
            customerId,
            items,
            totalAmount,
            receiptNumber,
        });
        yield newSale.save();
        // Update stock levels
        for (const item of items) {
            yield Items_1.default.findByIdAndUpdate(item._id, {
                $inc: { quantity: -item.quantity },
            });
        }
        res.status(201).json({ message: "Sale created successfully" });
    }
    catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ message: "Error creating sale", error });
    }
});
exports.createSale = createSale;
const fetchSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const allSales = yield Sale_1.default.find({ userId })
            .populate("customerId")
            .sort({ date: -1 });
        if (!allSales)
            res.status(400).json({ message: "get sales failed" });
        res.status(200).json(allSales);
    }
    catch (error) {
        console.error("Error in get sales:", error);
        res.status(500).json({ message: "Error finding sales" });
    }
});
exports.fetchSales = fetchSales;
const dashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log("userId------", userId);
        if (!userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const [totalCustomers, totalItems] = yield Promise.all([
            Customers_1.default.countDocuments({ userId }),
            Items_1.default.countDocuments({ userId }),
        ]);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Total Sales and Daily Earnings
        const salesData = yield Sale_1.default.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: "$date" },
                        },
                    },
                    totalSales: { $sum: "$totalAmount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // console.log("Sales Data:", salesData);
        const totalSales = salesData.reduce((sum, record) => sum + record.totalSales, 0);
        const lastFiveCustomers = yield Customers_1.default.find({ userId })
            .sort({ createdAt: -1 }) // Assuming timestamps
            .limit(5);
        const itemNames = yield Items_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);
        // Respond with aggregated data
        res.status(200).json({
            totalCustomers,
            totalItems,
            totalSales,
            dailyEarnings: salesData,
            lastFiveCustomers,
            itemNames,
        });
    }
    catch (error) {
        console.error("Error in fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});
exports.dashboardData = dashboardData;
