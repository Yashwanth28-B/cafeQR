// controllers/orderController.js
/*const Order = require("../models/Order");
const Table = require("../models/Table");
exports.placeOrder = async (req, res) => {
  const { tableId } = req.params;
  const { itemId, quantity } = req.body;
  let table = await Table.findOne({ tableId });
  if (!table) return res.status(404).json({ error: "Table not found" });
  let order;
  if (table.currentOrder) {
    order = await Order.findById(table.currentOrder);
  } else {
    order = new Order({ tableId, items: [] });
    await order.save();
    table.isOccupied = true;
    table.currentOrder = order._id;
    await table.save();
  }
  order.items.push({ item: itemId, quantity });
  await order.save();
  res.json(order);
};
exports.getTableOrder = async (req, res) => {
  const order = await Order.findOne({ tableId: req.params.tableId }).populate(
    "items.item"
  );
  res.json(order);
};
exports.markDelivered = async (req, res) => {
  const { tableId, itemIndex } = req.body;
  const order = await Order.findOne({ tableId });
  if (order && order.items[itemIndex]) {
    order.items[itemIndex].delivered = true;
    await order.save();
  }
  res.json(order);
};
exports.checkout = async (req, res) => {
  const order = await Order.findOne({ tableId: req.params.tableId }).populate(
    "items.item"
  );
  if (!order) return res.status(404).json({ error: "Order not found" });
  const subtotal = order.items.reduce(
    (sum, i) => sum + i.item.price * i.quantity,
    0
  );
  const tax = subtotal * 0.05;
  order.totalAmount = subtotal + tax;
  order.taxAmount = tax;
  order.isPaid = true;
  order.transactionDetails = {
    upiId: "dummy@upi",
    transactionId: "TXN" + Math.floor(Math.random() * 1000000),
    paymentTime: new Date(),
  };
  await order.save();
  await Table.updateOne(
    { tableId: req.params.tableId },
    { $set: { isOccupied: false, currentOrder: null } }
  );
  res.json({ success: true, order });
};
*/
const Order = require("../models/Order");
const Table = require("../models/Table");
const MenuItem = require("../models/MenuItem");

exports.placeOrder = async (req, res) => {
  const { tableId } = req.params;
  const { itemId, quantity } = req.body;

  try {
    const item = await MenuItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    let order = await Order.findOne({ tableId }).populate("items.item");

    if (!order) {
      order = new Order({ tableId, items: [] });
    }

    const existingItemIndex = order.items.findIndex((i) =>
      i.item._id.equals(itemId)
    );
    if (existingItemIndex > -1) {
      order.items[existingItemIndex].quantity += quantity;
    } else {
      order.items.push({ item: itemId, quantity, delivered: false });
    }

    await order.save();

    // Mark table as occupied
    await Table.updateOne(
      { tableId: parseInt(tableId) },
      { $set: { isOccupied: true, orders: order.items } }
    );

    res.json({ message: "Order placed", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
};

exports.getOrderByTable = async (req, res) => {
  const { tableId } = req.params;
  try {
    const order = await Order.findOne({ tableId }).populate("items.item");
    if (!order) return res.status(404).json({ message: "No order found" });
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get order", error: err.message });
  }
};

exports.markItemDelivered = async (req, res) => {
  const { tableId, itemIndex } = req.body;

  try {
    const order = await Order.findOne({ tableId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.items[itemIndex]) {
      order.items[itemIndex].delivered = true;
      await order.save();
    }

    res.json({ message: "Item marked as delivered", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to mark delivered", error: err.message });
  }
};

exports.checkoutOrder = async (req, res) => {
  const { tableId } = req.params;

  try {
    const order = await Order.findOne({ tableId }).populate("items.item");
    if (!order) return res.status(404).json({ message: "Order not found" });

    let total = 0;
    order.items.forEach((i) => {
      total += i.item.price * i.quantity;
    });

    const tax = total * 0.05;
    const grandTotal = total + tax;

    const transactionDetails = {
      transactionId: "TXN" + Date.now(),
      amount: grandTotal,
      status: "success",
    };

    // Clear order and reset table
    await Order.deleteOne({ tableId });

    await Table.updateOne(
      { tableId: parseInt(tableId) },
      {
        $set: {
          isOccupied: false,
          orders: [],
          bill: 0,
        },
      }
    );

    res.json({
      message: "Checkout complete",
      order: {
        tableId,
        totalAmount: grandTotal,
        transactionDetails,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed", error: err.message });
  }
};
