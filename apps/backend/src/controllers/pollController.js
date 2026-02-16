const prisma = require("../configs/prisma");

const createPoll = async (req, res) => {
    try {
        const { title, description, options } = req.body;

        if (!title || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Title and at least 2 options are required" });
        }

        const poll = await prisma.poll.create({
            data: {
                title,
                description,
                options: {
                    create: options.map((text) => ({ text })),
                },
            },
            include: {
                options: true,
            },
        });

        res.status(201).json(poll);
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ message: "Failed to create poll" });
    }
};

const getPoll = async (req, res) => {
    try {
        const { id } = req.params;
        const pollId = parseInt(id);

        if (isNaN(pollId)) {
            return res.status(400).json({ message: "Invalid poll ID" });
        }

        const poll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: {
                options: {
                    include: {
                        _count: {
                            select: { votes: true }
                        }
                    }
                },
                _count: {
                    select: { votes: true }
                }
            },
        });

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        const formattedPoll = {
            ...poll,
            options: poll.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                voteCount: opt._count.votes
            })),
            totalVotes: poll._count.votes
        };

        res.json(formattedPoll);
    } catch (error) {
        console.error("Error fetching poll:", error);
        res.status(500).json({ message: "Failed to fetch poll" });
    }
};

const votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { optionId } = req.body;
        const pollId = parseInt(id);
        const voterId = req.cookies.voterId;
        const ipAddress = req.ip || req.connection.remoteAddress;

        if (!voterId) {
            return res.status(400).json({ message: "Voter ID missing (cookies required)" });
        }

        if (isNaN(pollId) || !optionId) {
            return res.status(400).json({ message: "Invalid poll ID or missing option ID" });
        }

        const option = await prisma.option.findFirst({
            where: {
                id: optionId,
                pollId: pollId
            }
        });

        if (!option) {
            return res.status(400).json({ message: "Invalid option for this poll" });
        }

        const vote = await prisma.vote.create({
            data: {
                voterId,
                ipAddress: String(ipAddress),
                pollId,
                optionId
            }
        });

        const io = req.app.get("io");
        io.to(`poll_${pollId}`).emit("voteUpdate", { pollId });

        res.json({ message: "Vote recorded", vote });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "You have already voted on this poll" });
        }
        console.error("Error voting:", error);
        res.status(500).json({ message: "Failed to record vote" });
    }
};

const getAllPolls = async (req, res) => {
    try {
        const polls = await prisma.poll.findMany({
            include: {
                _count: {
                    select: { votes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedPolls = polls.map(poll => ({
            ...poll,
            totalVotes: poll._count.votes
        }));

        res.json(formattedPolls);
    } catch (error) {
        console.error("Error fetching all polls:", error);
        res.status(500).json({ message: "Failed to fetch all polls" });
    }
};

module.exports = {
    createPoll,
    getPoll,
    votePoll,
    getAllPolls
};
