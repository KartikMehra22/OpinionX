const express = require("express");
const { createPoll, getPoll, votePoll, getAllPolls } = require("../controllers/pollController");

const router = express.Router();

router.get("/all", getAllPolls);
router.get("/:id", getPoll);

router.post("/", createPoll);
router.post("/:id/vote", votePoll);

module.exports = router;
