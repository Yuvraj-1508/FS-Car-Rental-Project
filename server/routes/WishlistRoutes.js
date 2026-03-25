const express = require("express");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controller/WishlistController");
const auth = require("../middleware/Auth");

const router = express.Router();

router.post("/wishlist/add", auth, addToWishlist);
router.delete("/wishlist/remove/:carId", auth, removeFromWishlist);
router.get("/wishlist/all", auth, getWishlist);

module.exports = router;
