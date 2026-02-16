"use client";

import { useEffect, useState } from "react";
import { Plus, BarChart2 } from "lucide-react";
import Link from "next/link";
import api from "../../utils/api";
import PollGrid from "../../components/PollGrid";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllPolls();
    }, []);

    const fetchAllPolls = async () => {
        try {
            const res = await api.get("/api/polls/all");
            setPolls(res.data);
        } catch (error) {
            console.error("Failed to fetch polls", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
                    <div className="h-4 bg-gray-100 rounded w-64"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Active Polls
                    </h1>
                    <p className="text-sm text-gray-400 flex items-center gap-1.5">
                        <BarChart2 size={14} />
                        {polls.length} live poll{polls.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/create"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm"
                >
                    <Plus size={16} />
                    New Poll
                </Link>
            </motion.div>

            <PollGrid
                polls={polls}
                emptyMessage="No polls yet. Be the first to start a conversation!"
            />
        </div>
    );
}
