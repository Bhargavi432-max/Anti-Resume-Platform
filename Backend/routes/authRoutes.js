const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/signup", register);
router.post("/login", login);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user); // Send back full user object (id, name, email, role, skills)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
