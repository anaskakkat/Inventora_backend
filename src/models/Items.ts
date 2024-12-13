import mongoose, { Document, Schema } from "mongoose";

export interface IItem extends Document {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  userId: mongoose.Types.ObjectId; // Reference to the User model
}

const itemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, enum: ["litre", "kg"] },
  price: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate with a User
});

export default mongoose.model<IItem>("Item", itemSchema);
