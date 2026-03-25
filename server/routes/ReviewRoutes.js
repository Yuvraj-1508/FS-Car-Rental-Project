const express = require("express");
const { postReview, getCarReviews } = require("../controller/ReviewController");
const auth = require("../middleware/Auth"); // Existing Auth middleware

const router = express.Router();

router.post("/new-review", auth, postReview);
router.get("/car-reviews/:carId", getCarReviews);

module.exports = router;
