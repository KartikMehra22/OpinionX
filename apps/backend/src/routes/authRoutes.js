const express = require("express");
const { googleAuth, googleCallback, logout, getMe } = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

module.exports = router;
