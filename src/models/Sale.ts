import mongoose, { Document, Schema } from "mongoose";

// Interface for SaleItem
export interface SaleItem {
  _id: string;
  name: string;
  quantity: number;
  total: number;
}

// Interface for Sale
export interface Sale extends Document {
  userId: string; // Add userId to the interface
  customerId: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  receiptNumber: number;
}

// Schema for SaleItem
const SaleItemSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

// Schema for Sale
const SaleSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "User", // Reference the User model
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: "Customer", // Reference the Customer model
  },
  date: { type: String, required: true },
  items: { type: [SaleItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  receiptNumber: { type: String, required: true, unique: true },
});

// Create the Sale model
const SaleModel = mongoose.model<Sale>("Sale", SaleSchema);

export default SaleModel;
