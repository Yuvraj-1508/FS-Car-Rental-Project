const express = require("express")
require("dotenv").config()
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./DB/connectDB");
const UserRoutes = require("./routes/UserRoutes");
const CarRoutes = require("./routes/CarRoutes");
const BookingRoutes = require("./routes/BookingRoutes");
const visiterModel = require("./model/visiter.model");

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/carRental"
connectDB(DB_URL);


const app = express()

//use Middlware
app.use(express.json());
app.use(cors())
app.use(logger("combined"));
app.use(express.urlencoded({ extended: true }));
//home route
app.get("/", async (req, res) => {
    res.send("CarRental API")
});

//routes
app.use("/api", UserRoutes)
app.use("/api", CarRoutes)
app.use("/api", BookingRoutes)
app.use("/api", require("./routes/PaymentRoutes"));
app.use("/api", require("./routes/ReviewRoutes"));
app.use("/api", require("./routes/WishlistRoutes"));

//visiter
app.post("/new/visiter", async (req, res) => {
    try {
        const { email } = req?.body;

        if (!email) return res.status(404).json({ message: "email is required!" })

        const newVisiter = await visiterModel.create({ email: email });
        await newVisiter.save();

        return res.status(201).json({
            success: true,
            message: "new visiter add successfully"
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "error while new register add"
        })
    }
})

app.get("/all/visiter", async (req, res) => {
    try {
        const allVisiter = await visiterModel.find({});

        return res.status(201).json({
            success: true,
            message: "All visiter get successfully",
            total: allVisiter.length,
            data: allVisiter
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "error while all visiter get"
        })
    }
})

app.delete("/remove/visiter/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const Visiter = await visiterModel.findByIdAndDelete({ _id: id });

        return res.status(201).json({
            success: true,
            message: "delete visiter get successfully",
            Visiter
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "error while Delete visiter get"
        })
    }
})

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server is Running On PORT : ${PORT}`);
});