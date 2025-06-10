const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const Table = require("../models/Table");
const MenuItem = require("../models/MenuItem");
//const { auth } = require("../middleware/auth");

const router = express.Router();

// Get all orders (admin/staff)
router.get("/", async (req, res) => {
  try {
    const { status, tableId } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (tableId) filter.tableId = tableId;

    const orders = await Order.find(filter)
      .populate("tableId", "tableNumber")
      .populate("items.menuItem", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get order by table ID (public)
router.get("/table/:tableId", async (req, res) => {
  try {
    const order = await Order.findOne({
      tableId: req.params.tableId,
      status: "active",
    })
      .populate("tableId", "tableNumber")
      .populate("items.menuItem", "name price description image");

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new order
router.post(
  "/",
  [
    body("tableId").notEmpty().withMessage("Table ID is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tableId, items, customerName } = req.body;

      // Verify table exists
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!menuItem) {
          return res
            .status(404)
            .json({ message: `Menu item ${item.menuItem} not found` });
        }

        const itemTotal = menuItem.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          menuItem: item.menuItem,
          quantity: item.quantity,
          price: menuItem.price,
          notes: item.notes || "",
        });
      }

      const order = new Order({
        tableId,
        customerName: customerName || "Guest",
        items: orderItems,
        totalAmount,
      });

      await order.save();

      // Update table status
      await Table.findByIdAndUpdate(tableId, {
        status: "occupied",
        currentSession: order._id,
      });

      const populatedOrder = await Order.findById(order._id)
        .populate("tableId", "tableNumber")
        .populate("items.menuItem", "name price description");

      res.status(201).json(populatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Add items to existing order
router.post("/:id/items", async (req, res) => {
  try {
    const { items } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot add items to completed order" });
    }

    let additionalAmount = 0;
    const newItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res
          .status(404)
          .json({ message: `Menu item ${item.menuItem} not found` });
      }

      const itemTotal = menuItem.price * item.quantity;
      additionalAmount += itemTotal;

      newItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes || "",
      });
    }

    order.items.push(...newItems);
    order.totalAmount += additionalAmount;

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("tableId", "tableNumber")
      .populate("items.menuItem", "name price description");

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update item status (admin/staff)
router.patch("/:orderId/items/:itemId/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = status;
    await order.save();

    res.json({ message: "Item status updated", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Complete order and generate receipt
router.post("/:id/complete", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.menuItem",
      "name price"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    router.post("/delete-bulk", async (req, res) => {
      try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ message: "No order IDs provided" });
        }

        await Order.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "Orders deleted successfully" });
      } catch (error) {
        console.error("Bulk delete error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Generate receipt
    const receiptNumber = `RCP-${Date.now()}`;
    const subtotal = order.totalAmount;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const receiptItems = order.items.map((item) => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    order.receipt = {
      receiptNumber,
      generatedAt: new Date(),
      items: receiptItems,
      subtotal,
      tax,
      total,
    };

    order.status = "completed";
    order.sessionEndTime = new Date();
    order.paymentStatus = "paid";

    await order.save();

    // Free up the table
    await Table.findByIdAndUpdate(order.tableId, {
      status: "available",
      currentSession: null,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
