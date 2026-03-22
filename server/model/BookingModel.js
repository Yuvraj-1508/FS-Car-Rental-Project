const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
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
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        required: true
    },
    TotalPay: {
        type: String
    },
}, { timestamps: true })

const BookingModel = mongoose.model("booking", BookingSchema)

module.exports = BookingModel