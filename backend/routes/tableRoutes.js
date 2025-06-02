// routes/tableRoutes.js
const express = require("express");
const router = express.Router();
const { getTables, getTable } = require("../controllers/tableController");
router.get("/", getTables);
router.get("/:id", getTable);
module.exports = router;
