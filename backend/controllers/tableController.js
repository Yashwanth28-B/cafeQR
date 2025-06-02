// controllers/tableController.js
const Table = require("../models/Table");
const Order = require("../models/Order");
exports.getTables = async (req, res) => {
  const tables = await Table.find().populate("currentOrder");
  res.json(tables);
};
exports.getTable = async (req, res) => {
  const table = await Table.findOne({ tableId: req.params.id }).populate(
    "currentOrder"
  );
  res.json(table);
};
