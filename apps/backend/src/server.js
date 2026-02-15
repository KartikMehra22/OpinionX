const express = require("express");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./configs/cors");
const passport = require("./configs/passport");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

const pgSession = require("connect-pg-simple")(session);

app.use(
  session({
    store: new pgSession({
      conString: process.env.DIRECT_URL,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`DEBUG: NODE_ENV = ${process.env.NODE_ENV}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
