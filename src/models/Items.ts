import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
    name: string;
    description: string;
    quantity: number;
    price: number;
}

const itemSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

export default mongoose.model<IItem>('Item', itemSchema);
