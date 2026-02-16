const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./configs/cors");
const pollRoutes = require("./routes/pollRoutes");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;
const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

app.use((req, res, next) => {
  if (!req.cookies.voterId) {
    const voterId = uuidv4();
    res.cookie("voterId", voterId, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    req.cookies.voterId = voterId;
  }
  next();
});

app.use("/api/polls", pollRoutes);

app.get("/", (req, res) => {
  res.status(200).send("<h1>OpinionX Backend (Anonymous) 🚀</h1>");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_LOCAL_URL,
      process.env.FRONTEND_SERVER_URL,
    ].filter(Boolean),
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("joinPoll", (pollId) => {
    socket.join(`poll_${pollId}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
