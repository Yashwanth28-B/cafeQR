// controllers/menuController.js
const MenuItem = require("../models/MenuItem");
exports.getMenu = async (req, res) => {
  const menu = await MenuItem.find();
  res.json(menu);
};
exports.addMenuItem = async (req, res) => {
  const item = new MenuItem(req.body);
  await item.save();
  res.json(item);
};
exports.deleteMenuItem = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
