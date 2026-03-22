const PaymentModel = require("../model/PaymentModel");

const processPayment = async (req, res) => {
    try {
        const { bookingId, cardNumber, expDate, cvv, amount } = req.body;
        const userId = req.user.id;

        // Validation
        if (!bookingId || !cardNumber || !expDate || !cvv || !amount) {
            return res.status(400).json({
                success: false,
                message: "All payment fields are required"
            });
        }

        // Simulating Payment Verification (e.g. Stripe/Razorpay would go here)
        // For now, we accept any dummy data to satisfy the requirement
        if (cardNumber.length < 12) {
            return res.status(400).json({
                success: false,
                message: "Invalid Card Number length"
            });
        }

        const payment = await PaymentModel.create({
            userId,
            bookingId,
            cardNumber, // In production, never store raw card numbers!
            expDate,
            cvv,
            amount,
            status: "success"
        });

        res.status(201).json({
            success: true,
            message: "Payment processed successfully",
            payment
        });

    } catch (error) {
        console.error("Payment Processing Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Error processing payment",
            error: error.message
        });
    }
};

const getPayments = async (req, res) => {
    try {
        // Fetch all payments and populate user and booking details
        const payments = await PaymentModel.find()
            .populate("userId", "name email")
            .populate({
                path: "bookingId",
                populate: {
                    path: "carId",
                    select: "carName carCategory carRent"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error("Error fetching payments:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch payments records"
        });
    }
};

module.exports = {
    processPayment,
    getPayments
};
