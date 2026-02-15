"use client";

import { motion } from "framer-motion";
import { BarChart2, Calendar, User } from "lucide-react";
import Link from "next/link";

interface Poll {
    id: number;
    title: string;
    description: string | null;
    totalVotes: number;
    createdAt: string;
    creator?: {
        name: string;
    };
}

interface PollGridProps {
    polls: Poll[];
    emptyMessage: string;
}

const PollGrid = ({ polls, emptyMessage }: PollGridProps) => {
    if (polls.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll, index) => (
                <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {poll.title}
                        </h3>
                        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold flex items-center gap-1">
                            <BarChart2 size={12} />
                            {poll.totalVotes} votes
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                        {poll.description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(poll.createdAt).toLocaleDateString()}
                        </div>
                        {poll.creator && (
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                {poll.creator.name}
                            </div>
                        )}
                    </div>

                    <Link
                        href={`/polls/${poll.id}`}
                        className="mt-6 block w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-2xl text-center hover:bg-black hover:text-white transition-all transform group-hover:scale-[1.02]"
                    >
                        View Details
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};

export default PollGrid;
