const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Types.ObjectId,
        ref: "car",
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    bookingId: {
        type: mongoose.Types.ObjectId,
        ref: "booking",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ReviewModel = mongoose.model("review", ReviewSchema);

module.exports = ReviewModel;
