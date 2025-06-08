const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "delivered"],
    default: "pending",
  },
  notes: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    customerName: {
      type: String,
      default: "Guest",
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "qr", "online"],
      default: "qr",
    },
    sessionStartTime: {
      type: Date,
      default: Date.now,
    },
    sessionEndTime: {
      type: Date,
    },
    receipt: {
      receiptNumber: String,
      generatedAt: Date,
      items: [
        {
          name: String,
          quantity: Number,
          price: Number,
          total: Number,
        },
      ],
      subtotal: Number,
      tax: Number,
      total: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
