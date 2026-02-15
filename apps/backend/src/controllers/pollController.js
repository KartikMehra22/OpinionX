const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
                creatorId: req.user.id,
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
                creator: {
                    select: { id: true, name: true, avatar: true }, // Assuming avatar exists or just name
                },
                options: {
                    include: {
                        votes: true, // we might want just count, but let's get full data for now or use _count
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

        // Transform data to cleaner format if needed
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
        const userId = req.user.id;

        if (isNaN(pollId) || !optionId) {
            return res.status(400).json({ message: "Invalid poll ID or missing option ID" });
        }

        // Verify option belongs to poll
        const option = await prisma.option.findFirst({
            where: {
                id: optionId,
                pollId: pollId
            }
        });

        if (!option) {
            return res.status(400).json({ message: "Invalid option for this poll" });
        }

        // Create vote
        const vote = await prisma.vote.create({
            data: {
                userId,
                pollId,
                optionId
            }
        });

        res.json({ message: "Vote recorded", vote });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Already voted" });
        }
        console.error("Error voting:", error);
        res.status(500).json({ message: "Failed to record vote" });
    }
};

module.exports = {
    createPoll,
    getPoll,
    votePoll
};
