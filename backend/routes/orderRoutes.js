// routes/orderRoutes.js
/*const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getTableOrder,
  markDelivered,
  checkout,
} = require("../controllers/orderController");
router.post("/:tableId", placeOrder);
router.get("/:tableId", getTableOrder);
router.patch("/deliver", markDelivered);
router.post("/:tableId/checkout", checkout);
module.exports = router;

*/
const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrderByTable,
  markItemDelivered,
  checkoutOrder,
} = require("../controllers/orderController");

router.post("/:tableId", placeOrder);
router.get("/:tableId", getOrderByTable);
router.patch("/deliver", markItemDelivered);
router.post("/:tableId/checkout", checkoutOrder);

module.exports = router;
