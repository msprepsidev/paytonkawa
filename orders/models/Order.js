// date, client, état commande, produits

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
createdAt: {
    type: Date,
    required: true,
    default: Date.now
},
customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
},
details: [{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}],
status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
}
});

export const Order = mongoose.model('Order', orderSchema);
