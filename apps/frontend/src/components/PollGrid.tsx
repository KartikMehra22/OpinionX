import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";

interface Poll {
    id: number;
    title: string;
    description?: string;
    totalVotes: number;
}

interface PollGridProps {
    polls: Poll[];
    emptyMessage: string;
}

export default function PollGrid({ polls, emptyMessage }: PollGridProps) {
    if (!polls || polls.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart2 className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.map((poll, index) => (
                <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link
                        href={`/polls/${poll.id}`}
                        className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                    >
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {poll.title}
                        </h3>
                        {poll.description && (
                            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{poll.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <BarChart2 size={12} />
                                {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
