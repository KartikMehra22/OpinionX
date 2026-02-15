const express = require("express");
const passport = require("passport");
const { googleCallback, logout, refresh, getMe } = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", googleCallback);

router.post("/logout", logout);

router.post("/refresh", refresh);

router.get("/me", authenticate, getMe);

module.exports = router;
