const express = require("express");
const { createPoll, getPoll, votePoll, getMyPolls, getAllPolls } = require("../controllers/pollController");
const { authenticate, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/my-polls", authenticate, getMyPolls);
router.get("/admin/all-polls", isAdmin, getAllPolls);
router.get("/:id", getPoll);

router.post("/", isAdmin, createPoll);
router.post("/:id/vote", authenticate, votePoll);

module.exports = router;
