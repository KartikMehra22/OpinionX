const passport = require("passport");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" });

const googleCallback = (req, res, next) => {
    const isProd = process.env.NODE_ENV === "production";
    const FRONTEND_URL = isProd ? process.env.FRONTEND_SERVER_URL : process.env.FRONTEND_LOCAL_URL;

    passport.authenticate("google", {
        successRedirect: `${FRONTEND_URL}/dashboard`,
        failureRedirect: `${FRONTEND_URL}/login?error=auth_failed`,
    })(req, res, next);
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
    });
};

const getMe = (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = {
    googleAuth,
    googleCallback,
    logout,
    getMe
};
