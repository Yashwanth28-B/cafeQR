const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  stock: Number,
  category: String,
});
module.exports = mongoose.model("MenuItem", menuItemSchema);
// This schema defines the structure of a menu item in the database.
