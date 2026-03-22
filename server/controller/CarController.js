const { default: mongoose } = require("mongoose");
const CarModel = require("../model/CarModel");

const fs = require("fs");

const CreateCarController = async (req, res) => {
    try {
        const {
            carName,
            carCategory,
            carYear,
            carSeats,
            carFuel,
            carGear,
            location,
            carRent
        } = req.fields;

        // Validate required fields
        if (!carName || !carCategory || !carSeats || !carFuel || !carGear || !location || !carRent) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Validate image upload
        if (!req.files || !req.files.carImage) {
            return res.status(400).json({
                success: false,
                message: "Car image is required"
            });
        }

        // Convert image to buffer
        const carImage = fs.readFileSync(req.files.carImage.path);

        const car = await CarModel.create({
            carName,
            carImage,
            carCategory,
            carYear,
            carSeats,
            carFuel,
            carGear,
            location,
            carRent
        });

        res.status(201).json({
            success: true,
            message: "Car created successfully",
            car
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating car",
            error: error.message
        });
    }
};

const getAllCars = async (req, res) => {
    try {
        const cars = await CarModel.find();

        const carsWithImages = cars.map((car) => {
            let carImageBase64 = null;
            if (car.carImage) {
                const contentType = "image/jpeg";
                carImageBase64 = `data:${contentType};base64,${car.carImage.toString("base64")}`;
            }

            return {
                ...car.toObject(),
                carImage: carImageBase64,
            };
        });

        const totalCars = await CarModel.countDocuments();
        res.status(200).json({
            success: true,
            count: carsWithImages.length,
            totalCars: totalCars,
            cars: carsWithImages,
        });
    } catch (error) {
        console.error("Error fetching cars:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching cars",
            error: error.message,
        });
    }
};



const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await CarModel.findById(id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found",
            });
        }

        let carImageData = null;
        if (car.carImage) {
            const contentType = "image/jpeg"; // adjust if you store MIME type in schema
            carImageData = `data:${contentType};base64,${car.carImage.toString("base64")}`;
        }

        res.status(200).json({
            success: true,
            car: {
                ...car.toObject(),
                carImage: carImageData,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching car",
            error: error.message,
        });
    }
};

const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        // ✅ validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid car ID",
            });
        }

        // Use req.fields because we're using formidable middleware
        const updatedData = { ...req.fields };

        // Handle car image update if provided
        if (req.files && req.files.carImage && req.files.carImage.size > 0) {
            updatedData.carImage = fs.readFileSync(req.files.carImage.path);
        }

        const car = await CarModel.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Car updated successfully",
            car,
        });
    } catch (error) {
        console.error("Update Car Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating car",
            error: error.message,
        });
    }
};




const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await CarModel.findByIdAndDelete(id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Car deleted successfully"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Error deleting car",
            error: error.message
        });
    }
};


module.exports = {
    CreateCarController,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
}