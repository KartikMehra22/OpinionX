const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await prisma.user.findUnique({
                    where: { googleId: profile.id },
                });

                if (!user) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: profile.emails[0].value }
                    });

                    if (existingUser) {
                        user = await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { googleId: profile.id }
                        });
                    } else {
                        user = await prisma.user.create({
                            data: {
                                googleId: profile.id,
                                email: profile.emails[0].value,
                                name: profile.displayName,
                            },
                        });
                    }
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
