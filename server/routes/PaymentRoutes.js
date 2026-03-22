const express = require("express");
const auth = require("../middleware/Auth");
const { processPayment, getPayments } = require("../controller/PaymentController");
const router = express.Router();

router.post("/process/payment", auth, processPayment);
router.get("/all/payments", auth, getPayments);

module.exports = router;
