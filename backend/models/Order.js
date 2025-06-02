// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
  quantity: Number,
  delivered: { type: Boolean, default: false },
});
const orderSchema = new mongoose.Schema({
  tableId: Number,
  items: [orderItemSchema],
  isPaid: { type: Boolean, default: false },
  totalAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  transactionDetails: {
    upiId: String,
    transactionId: String,
    paymentTime: Date,
  },
});
module.exports = mongoose.model("Order", orderSchema);
