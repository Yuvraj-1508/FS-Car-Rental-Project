const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

// Replace with your secret key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const RegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("-------------------------------------------------------------")
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All input are required (name, email, password)"
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        // Create JWT payload
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            name: user.name,
            role: user.role,
            token
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error.message
        });
    }
};

const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Create JWT
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

        return res.status(200).json({
            success: true,
            message: "User login successful",
            name: user.name,
            role: user.role,
            token
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Error while login",
            error: error.message
        });
    }
};




const GetAllUserController = async (req, res) => {
    try {
        const users = await UserModel.find({});

        // If no users found
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }

        const totalUsers = await UserModel.countDocuments();


        // Success response
        return res.status(200).json({
            success: true,
            count: users.length,
            totalUsers,
            users,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Error while getting all users",
            error: error.message
        });
    }
};


module.exports = { RegisterController, LoginController, GetAllUserController };
