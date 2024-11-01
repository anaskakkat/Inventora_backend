import mongoose, { Document, Schema } from "mongoose";

export interface SaleItem {
  _id: string;
  name: string;
  quantity: number;
  total: number;
}

export interface Sale extends Document {
  customerId: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  receiptNumber: number;
}

const SaleItemSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const SaleSchema: Schema = new Schema({
  customerId: { type: String, required: true },
  date: { type: String, required: true },
  items: { type: [SaleItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  receiptNumber: { type: String, required: true, unique: true },
});

const SaleModel = mongoose.model<Sale>("Sale", SaleSchema);

export default SaleModel;
