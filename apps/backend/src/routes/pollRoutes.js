const express = require("express");
const { createPoll, getPoll, votePoll } = require("../controllers/pollController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/:id", getPoll);

// Protected routes
router.post("/", authenticate, createPoll);
router.post("/:id/vote", authenticate, votePoll);

module.exports = router;
