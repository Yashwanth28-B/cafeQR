const express = require("express");
const { body, validationResult } = require("express-validator");
const MenuItem = require("../models/MenuItem");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all menu items (public)
router.get("/", async (req, res) => {
  try {
    const { category, available } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.isAvailable = available === "true";

    const menuItems = await MenuItem.find(filter).sort({
      category: 1,
      name: 1,
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single menu item
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
/*
// Create menu item (admin only)
router.post(
  "/",
  [
    auth,
    adminAuth,
    [
      body("name").notEmpty().withMessage("Name is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("price").isNumeric().withMessage("Price must be a number"),
      body("category")
        .isIn([
          "appetizers",
          "main-course",
          "desserts",
          "beverages",
          "specials",
        ])
        .withMessage("Invalid category"),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const menuItem = new MenuItem(req.body);
      await menuItem.save();
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
*/
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category")
      .isIn(["appetizers", "main-course", "desserts", "beverages", "specials"])
      .withMessage("Invalid category"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const menuItem = new MenuItem(req.body);
      await menuItem.save();
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update menu item (admin only)
router.put("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete menu item (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
