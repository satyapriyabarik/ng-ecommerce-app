import { model, Schema } from 'mongoose';

const ProductSchema = new Schema({
    title: String,
    descriptions: String,
    price: Number,
    inStock: Boolean,
    imageUrl: String,
    category: String,
});

export const ProductModel = model('Product', ProductSchema);
