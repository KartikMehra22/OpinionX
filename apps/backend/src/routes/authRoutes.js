const express = require("express");
const passport = require("passport");
const { googleCallback, logout, refresh } = require("../controllers/authController");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", googleCallback);

router.post("/logout", logout);

router.post("/refresh", refresh);

module.exports = router;
