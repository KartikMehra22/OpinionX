const passport = require("passport");
const prisma = require("./prisma");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google Strategy Callback:", profile.id, profile.emails[0].value);

                let user = await prisma.user.findUnique({
                    where: { googleId: profile.id },
                });

                if (!user) {
                    console.log("User not found by googleId. Checking email...");
                    const existingUser = await prisma.user.findUnique({
                        where: { email: profile.emails[0].value }
                    });

                    if (existingUser) {
                        console.log("Linking to existing user:", existingUser.id);
                        user = await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { googleId: profile.id }
                        });
                    } else {
                        console.log("Creating new user...");
                        user = await prisma.user.create({
                            data: {
                                googleId: profile.id,
                                email: profile.emails[0].value,
                                name: profile.displayName,
                            },
                        });
                    }
                } else {
                    console.log("User found by googleId:", user.id);
                }
                return done(null, user);
            } catch (error) {
                console.error("Passport Config Error:", error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
