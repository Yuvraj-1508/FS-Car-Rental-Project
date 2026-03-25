const ReviewModel = require("../model/ReviewModel");
const BookingModel = require("../model/BookingModel");

const postReview = async (req, res) => {
    try {
        const { carId, bookingId, rating, comment } = req.body;
        const userId = req.user.id;

        // Check if review already exists for this booking
        const existingReview = await ReviewModel.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "Review already submitted for this booking" });
        }

        const review = await ReviewModel.create({
            carId,
            userId,
            bookingId,
            rating,
            comment
        });

        res.status(201).json({ success: true, message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error submitting review", error: error.message });
    }
};

const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;
        const reviews = await ReviewModel.find({ carId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
    }
};

module.exports = { postReview, getCarReviews };
