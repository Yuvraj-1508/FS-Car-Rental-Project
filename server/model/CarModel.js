const mongoose = require("mongoose")

const CarSchema = new mongoose.Schema({
    carName: {
        type: String,
        required: true
    },
    carImage: {
        type: Buffer,
        contentType: String,
        required: true
    },
    carCategory: {
        type: String,
        enum: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van", "Pickup", "Sports"],
        required: true
    },
    carYear: {
        type: String
    },
    carSeats: {
        type: String,
        required: true
    },
    carFuel: {
        type: String,
        enum: ["Diesel", "Hybrid", "Petrol"],
        required: true
    },
    carGear: {
        type: String,
        enum: ["Manual", "Automatic"],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    carRent: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
})

const CarModel = mongoose.model("car", CarSchema);

module.exports = CarModel