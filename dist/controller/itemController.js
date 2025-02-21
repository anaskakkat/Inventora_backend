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
exports.editItems = exports.deleteItem = exports.getAllItems = exports.createItem = void 0;
const Items_1 = __importDefault(require("../models/Items"));
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("--signout---body----", req.body);
    const { name, description, quantity, unit, price } = req.body;
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const existingItem = yield Items_1.default.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            userId,
        });
        if (existingItem) {
            res
                .status(400)
                .json({ message: "Item with the same name already exists." });
            return;
        }
        const newItem = new Items_1.default({
            name,
            description,
            quantity,
            unit,
            price,
            userId,
        });
        yield newItem.save();
        res.status(201).json({ message: "Item created successfully" });
    }
    catch (error) {
        console.error("Error in createItem:", error);
        res.status(500).json({ message: "Error creating item" });
    }
});
exports.createItem = createItem;
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID not found" });
            return;
        }
        const allItems = yield Items_1.default.find({ userId });
        if (!allItems)
            res.status(400).json({ message: "get item failed" });
        res.status(200).json(allItems);
    }
    catch (error) {
        console.error("Error in get Item:", error);
        res.status(500).json({ message: "Error finding item" });
    }
});
exports.getAllItems = getAllItems;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("--signout---body----", req.params.itemId);
    const { itemId } = req.params;
    try {
        const deletedItem = yield Items_1.default.findByIdAndDelete(itemId);
        if (!deletedItem) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        console.error("Error in delete Item:", error);
        res.status(500).json({ message: "Error deleting item" });
    }
});
exports.deleteItem = deleteItem;
const editItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }
    try {
        const item = yield Items_1.default.findOne({ _id: itemId, userId });
        if (!item) {
            res
                .status(404)
                .json({ message: "Item not found or unauthorized access" });
            return;
        }
        const existingItem = yield Items_1.default.findOne({
            name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
            _id: { $ne: itemId },
            userId,
        });
        if (existingItem) {
            res
                .status(400)
                .json({ message: "Item with the same name already exists." });
            return;
        }
        const updatedItem = yield Items_1.default.findByIdAndUpdate(itemId, Object.assign(Object.assign({}, req.body), { userId }), {
            new: true,
        });
        if (!updatedItem) {
            res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({
            message: "Item updated successfully",
        });
    }
    catch (error) {
        console.error("Error in edit item:", error);
        res.status(500).json({ message: "Error updating item" });
    }
});
exports.editItems = editItems;
