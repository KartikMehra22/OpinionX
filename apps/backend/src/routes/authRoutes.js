const express = require("express");
const passport = require("passport");
const { googleAuth, googleCallback, logout, refresh, getMe } = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/google", googleAuth);

router.get("/google/callback", googleCallback);

router.post("/logout", logout);

router.post("/refresh", refresh);

router.get("/me", authenticate, getMe);

module.exports = router;
