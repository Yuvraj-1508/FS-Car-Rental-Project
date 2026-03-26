const express = require("express")
const nodemailer = require("nodemailer");
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

// Email Transporter configuration (Static Way)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "admin@gmail.com",       // <--- Put your REAL Gmail address here
        pass: "your-app-password",    // <--- Put your 16-character APP PASSWORD here
    },
});
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

        // Send Professional Welcome Email
        const mailOptions = {
            from: "admin@gmail.com",   // <--- Match your transporter email
            to: email,
            subject: "Welcome to GoCar Elite Fleet! 🚀",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h1 style="color: #2563eb; margin: 0;">GOCAR</h1>
                        <p style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Premium Mobility Solutions</p>
                    </div>
                    <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                        <h2 style="color: #1e293b; margin-top: 0;">Welcome to the Inner Circle!</h2>
                        <p style="color: #475569; line-height: 1.6;">Hello,</p>
                        <p style="color: #475569; line-height: 1.6;">Thank you for subscribing to the GoCar newsletter. You are now part of an elite community of over 10,000 car enthusiasts.</p>
                        <p style="color: #475569; line-height: 1.6;">As a member, you'll receive first-look access to our most exclusive luxury fleet additions, seasonal discounts, and curated driving guides.</p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #ffffff; border-left: 4px solid #2563eb; border-radius: 4px;">
                            <p style="margin: 0; font-weight: bold; color: #1e293b;">Your First Reward:</p>
                            <p style="margin: 5px 0 0; color: #2563eb; font-size: 18px; font-weight: black;">USE CODE: <strong>GOPREMIUM20</strong></p>
                            <p style="margin: 5px 0 0; color: #64748b; font-size: 12px;">Get 20% off your next luxury car rental.</p>
                        </div>
                        
                        <a href="http://localhost:5173" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Browse Elite Fleet</a>
                    </div>
                    <div style="text-align: center; padding-top: 20px; color: #94a3b8; font-size: 12px;">
                        <p>&copy; ${new Date().getFullYear()} GoCar Rental. All rights reserved.</p>
                        <p>1234 Luxury Drive, Surat Gujarat, 395006</p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log("Email error:", emailError.message);
            // We don't fail the registration if email fails, but we log it
        }

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