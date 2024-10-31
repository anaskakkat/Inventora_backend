import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  address: string;
  mobile: number;

}

const customerSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  mobile: { type: Number, required: true },

});

export default mongoose.model<ICustomer>("Customer", customerSchema);
