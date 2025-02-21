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
exports.getSalesDatabyCustomerId = exports.updateCustomer = exports.deleteCustomer = exports.fetchCustomerData = exports.createCustomer = void 0;
const Customers_1 = __importDefault(require("../models/Customers"));
const Sale_1 = __importDefault(require("../models/Sale"));
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, mobile } = req.body;
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID not found" });
            return;
        }
        const existingCustomer = yield Customers_1.default.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            userId,
        });
        if (existingCustomer) {
            res.status(400).json({
                message: "Customer with the same name already exists for this user.",
            });
            return;
        }
        const newCustomer = new Customers_1.default({ name, address, mobile, userId });
        yield newCustomer.save();
        res.status(201).json({
            message: "Customer created successfully",
            customer: newCustomer,
        });
    }
    catch (error) {
        console.error("Error in createCustomer:", error);
        res.status(500).json({ message: "Error creating customer" });
    }
});
exports.createCustomer = createCustomer;
const fetchCustomerData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID not found" });
            return;
        }
        const customerData = yield Customers_1.default.find({ userId });
        if (!customerData)
            res.status(400).json({ message: "get Customers failed" });
        res.status(200).json(customerData);
    }
    catch (error) {
        console.error("Error in get Customers:", error);
        res.status(500).json({ message: "Error finding Customers" });
    }
});
exports.fetchCustomerData = fetchCustomerData;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("--signout---body----", req.params.customerId);
    const { customerId } = req.params;
    try {
        const deletedCustomer = yield Customers_1.default.findByIdAndDelete(customerId);
        if (!deletedCustomer) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    }
    catch (error) {
        console.error("Error in delete Customer:", error);
        res.status(500).json({ message: "Error deleting Customer" });
    }
});
exports.deleteCustomer = deleteCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params; // Ensure you're correctly extracting itemId from req.params
    console.log("--updateCustomer---itemId----", customerId, "------body------", req.body);
    try {
        const existingItem = yield Customers_1.default.findOne({
            name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
            _id: { $ne: customerId },
        });
        if (existingItem) {
            res
                .status(400)
                .json({ message: "Customer with the same name already exists." });
            return;
        }
        const updatedItem = yield Customers_1.default.findByIdAndUpdate(customerId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedItem) {
            res.status(404).json({ message: "Customer not found" });
            return;
        }
        res.status(200).json({
            message: "Customer updated successfully",
        });
    }
    catch (error) {
        console.error("Error in updating customer:", error);
        res.status(500).json({ message: "Error updating customer" });
    }
});
exports.updateCustomer = updateCustomer;
const getSalesDatabyCustomerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        // Convert customerId to ObjectId
        // const customerObjectId = new mongoose.Types.ObjectId(customerId);
        // Find sales for the given customerId
        const sales = yield Sale_1.default.find({ customerId });
        if (sales.length === 0) {
            res.status(404).json({ message: "No sales found for this customer." });
            return;
        }
        // Return found sales
        res.status(200).json(sales);
    }
    catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getSalesDatabyCustomerId = getSalesDatabyCustomerId;
