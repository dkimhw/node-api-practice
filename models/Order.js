const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
});

const OrderSchema = new mongoose.Schema({
    tax: {
      type: Number,
      default: .25,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 49,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: {
      type: [SingleOrderItemSchema],
    },
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', ''],
      default: 'pending'
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', OrderSchema)
