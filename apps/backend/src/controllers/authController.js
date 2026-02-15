const passport = require("passport");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" });

const googleCallback = (req, res, next) => {
    passport.authenticate("google", {
        successRedirect: `${process.env.FRONTEND_SERVER_URL}/dashboard`,
        failureRedirect: `${process.env.FRONTEND_SERVER_URL}/login?error=auth_failed`,
    })(req, res, next);
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.clearCookie("connect.sid"); // Clear session cookie
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
