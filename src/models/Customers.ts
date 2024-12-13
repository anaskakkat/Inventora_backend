import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  address: string;
  mobile: number;
  userId: mongoose.Types.ObjectId; // Reference to the user
}

const customerSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  mobile: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add reference to the User model
});

export default mongoose.model<ICustomer>("Customer", customerSchema);
