const express = require("express");
const Table = require("../models/Table");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().populate("currentSession");
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get table by ID
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate(
      "currentSession"
    );
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get table by QR code
router.get("/qr/:qrCode", async (req, res) => {
  try {
    const table = await Table.findOne({ qrCode: req.params.qrCode });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create table (admin only)
router.post("/", [auth, adminAuth], async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update table (admin only)
router.put("/:id", [auth, adminAuth], async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
