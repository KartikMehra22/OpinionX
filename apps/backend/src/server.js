const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./configs/cors");
const passport = require("./configs/passport");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

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
