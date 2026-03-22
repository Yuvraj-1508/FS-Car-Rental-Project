const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
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
    cardNumber: {
        type: String,
        required: true
    },
    expDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "success"
    }
}, { timestamps: true });

const PaymentModel = mongoose.model("payment", PaymentSchema);

module.exports = PaymentModel;
