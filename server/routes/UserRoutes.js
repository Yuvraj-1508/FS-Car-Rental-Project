const express = require("express")
const router = express.Router();
const { RegisterController, LoginController, GetAllUserController } = require("../controller/UserController");

// Test route
router.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from UserRoutes" });
});

// Register route
router.post("/register", RegisterController);

// Login route
router.post("/login", LoginController);

router.get("/all/users", GetAllUserController)

module.exports = router;
