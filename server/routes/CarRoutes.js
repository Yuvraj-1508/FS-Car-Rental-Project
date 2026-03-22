const express = require("express");
const {
    CreateCarController,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
} = require("../controller/CarController");
const CarModel = require("../model/CarModel");
const router = express.Router();
const formidable = require("express-formidable");


//create car
router.post("/create/car", formidable(), CreateCarController)

//get all cars
router.get("/cars", getAllCars)

//get car by id
router.get("/car/:id", getCarById)

//update car
router.patch("/update/car/:id", formidable(), updateCar);

//delete Car
router.delete("/delete/car/:id", deleteCar)

//searching car
router.get("/search", async (req, res) => {
    try {
        const { q } = req.query; // search query from client

        if (!q) {
            return res.status(400).json({ success: false, message: "Query is required" });
        }

        // MongoDB search using regex (like %q% in SQL)
        const cars = await CarModel.find({
            $and: [
                { isAvailable: { $ne: false } },
                {
                    $or: [
                        { carName: { $regex: q, $options: "i" } },
                        { location: { $regex: q, $options: "i" } },
                        { carRent: isNaN(q) ? undefined : Number(q) }
                    ].filter(Boolean)
                }
            ]
        });
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
        res.json({ success: true, total: carsWithImages.length, data: carsWithImages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router