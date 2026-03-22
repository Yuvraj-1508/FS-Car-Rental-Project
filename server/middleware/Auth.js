const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || ""

const auth = (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // attach decoded payload to req.user
        next(); // allow request to continue

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};

module.exports = auth;
