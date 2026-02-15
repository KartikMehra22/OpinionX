const jwt = require("jsonwebtoken");
const { verifyAccessToken } = require("../utils/jwt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized: No access token" });
        }

        const decoded = verifyAccessToken(accessToken);

        // Optional: Fetch fresh user data from DB if needed, or just use decoded payload
        // const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        // if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authenticate;
