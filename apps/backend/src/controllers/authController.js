const passport = require("passport");
const jwt = require("jsonwebtoken");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect(`${process.env.FRONTEND_SERVER_URL}/login?error=auth_failed`);

        const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
        const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(`${process.env.FRONTEND_SERVER_URL}/dashboard`);
    })(req, res, next);
};

const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
};

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ accessToken: newAccessToken });
    });
};

const getMe = (req, res) => {
    res.json(req.user);
};

module.exports = {
    googleAuth,
    googleCallback,
    logout,
    refresh,
    getMe
};
