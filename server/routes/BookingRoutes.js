const express = require("express")
const auth = require("../middleware/Auth")
const { newBooking, MyBooking, getAllBookings, updateBookingStatus, DeleteBooking } = require("../controller/BookingController")
const router = express.Router()

router.post("/new/booking", auth, newBooking)

router.get("/myBooking", auth, MyBooking)

router.get("/all/booking", auth, getAllBookings);

router.put("/all/booking/:id", auth, updateBookingStatus);

router.delete("/delete/booking/:id", DeleteBooking);

module.exports = router