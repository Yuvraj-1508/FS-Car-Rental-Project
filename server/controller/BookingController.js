const BookingModel = require("../model/BookingModel");
const CarModel = require("../model/CarModel");

const newBooking = async (req, res) => {
    try {
        const { carId, fromDate, toDate } = req.body;
        const userId = req.user.id; // from middleware

        // Validate required fields
        if (!carId || !fromDate || !toDate) {
            return res.status(400).json({
                success: false,
                message: "Car, fromDate, and toDate are required",
            });
        }

        // Convert dates safely (expecting YYYY-MM-DD or ISO strings)
        const start = new Date(fromDate);
        const end = new Date(toDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD",
            });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "toDate must be after fromDate",
            });
        }

        // Calculate total days (at least 1 day)
        const diffTime = end.getTime() - start.getTime();
        const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

        // Fetch car details
        const car = await CarModel.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        // Calculate total pay based on carRent
        // Example formats handled: "200/day", "₹200", "200"
        const rentPerDay = parseFloat(String(car.carRent).replace(/[^0-9.]/g, ""));
        if (isNaN(rentPerDay)) {
            return res.status(400).json({
                success: false,
                message: "Invalid carRent format in CarModel",
            });
        }

        const totalPay = rentPerDay * totalDays;

        // Check if car is already booked for these dates (by anyone)
        const overlappingBooking = await BookingModel.findOne({
            carId,
            status: { $in: ["pending", "confirmed"] },
            $or: [
                {
                    fromDate: { $lte: end.toISOString() },
                    toDate: { $gte: start.toISOString() }
                }
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({
                success: false,
                message: "This vehicle is already reserved for the selected timeline. Please adjust your dates.",
            });
        }

        // Create booking
        const booking = await BookingModel.create({
            carId,
            userId,
            fromDate: start.toISOString(),
            toDate: end.toISOString(),
            TotalPay: totalPay,
            status: req.body.status || "pending",
        });

        res.status(201).json({
            success: true,
            message: `Booking created successfully for ${totalDays} day(s). Total pay: Rs.${totalPay}`,
            booking,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message,
        });
    }
};

//mybooking
const MyBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        let bookings = await BookingModel.find({ userId })
            .sort({ created_at: -1 })
            .populate("carId"); // include carImage

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this user",
            });
        }

        // Convert carImage to data URI
        bookings = bookings.map((booking) => {
            const car = booking.carId.toObject();

            let carImageData = null;
            if (car.carImage) {
                const contentType = "image/jpeg"; // adjust if storing MIME type
                carImageData = `data:${contentType};base64,${car.carImage.toString("base64")}`;
            }

            return {
                ...booking.toObject(),
                carId: {
                    ...car,
                    carImage: carImageData,
                },
            };
        });

        return res.status(200).json({
            success: true,
            message: "My bookings fetched successfully",
            result: bookings,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Error while fetching my bookings",
            error: error.message,
        });
    }
};



//get all booking
const getAllBookings = async (req, res) => {
    try {
        let bookings = await BookingModel.find()
            .populate("carId")
            .populate("userId")
            .sort({ createdAt: -1 })
            .lean();

        bookings = bookings.map((booking) => {
            const car = booking.carId;
            let carImage = null;

            if (car?.carImage) {
                let buffer;
                // Check if carImage is nested (with .data) or direct Buffer
                if (car.carImage.data) {
                    buffer = car.carImage.data;
                } else {
                    buffer = car.carImage;
                }

                const mimeType = "image/jpeg"; // adjust if needed
                carImage = `data:${mimeType};base64,${buffer.toString("base64")}`;
            }

            return {
                ...booking,
                carId: {
                    ...car,
                    carImage,
                },
            };
        });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("❌ Error in GetAllBookingsController:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message,
        });
    }
};


// ✅ Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await BookingModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate("carId", "carName year type location carImage")
            .populate("userId", "name email");

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error("Error updating booking:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update booking",
        });
    }
};

const DeleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await BookingModel.findByIdAndDelete(id)
            .populate("carId", "carName year type location carImage")
            .populate("userId", "name email");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
            booking,
        });
    } catch (error) {
        console.error("Error deleting booking:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to delete booking",
            error: error.message,
        });
    }
};


//change stutus for booking

module.exports = {
    newBooking,
    MyBooking,
    getAllBookings,
    updateBookingStatus,
    DeleteBooking

}