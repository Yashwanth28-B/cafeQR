const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableId: { type: Number, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  qrUrl: String,
});
module.exports = mongoose.model("Table", tableSchema);
