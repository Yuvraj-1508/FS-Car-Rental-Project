const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    carId: {
        type: mongoose.Types.ObjectId,
        ref: "car",
        required: true
    }
}, { timestamps: true });

// Prevent duplicate wishlist items for same user/car
WishlistSchema.index({ userId: 1, carId: 1 }, { unique: true });

const WishlistModel = mongoose.model("wishlist", WishlistSchema);
module.exports = WishlistModel;
