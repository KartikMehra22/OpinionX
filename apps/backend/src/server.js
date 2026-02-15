const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const passport = require("./configs/passport");
const authRoutes = require("./routes/authRoutes");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

const app = express();
const PORT = process.env.SERVER_PORT || 5001;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const isProd = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: isProd ? process.env.FRONTEND_SERVER_URL : process.env.FRONTEND_LOCAL_URL,
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Session Configuration
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "Session", // Matches the Prisma model name if mapped, or handled by connector
      createTableIfMissing: false, // We rely on Prisma to create the table
    }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`DEBUG: NODE_ENV = ${process.env.NODE_ENV}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
