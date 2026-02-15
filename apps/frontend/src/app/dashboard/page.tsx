"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Plus, Layout } from "lucide-react";
import Link from "next/link";
import api from "../../utils/api";
import PollGrid from "../../components/PollGrid";
import { motion } from "framer-motion";

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMyPolls();
        }
    }, [user]);

    const fetchMyPolls = async () => {
        try {
            const res = await api.get("/api/polls/my-polls");
            setPolls(res.data);
        } catch (error) {
            console.error("Failed to fetch polls", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-gray-200 rounded-full w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-200 rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Welcome back, <span className="text-indigo-600">{user?.name}</span>!
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <Layout size={18} />
                        You have created {polls.length} polls so far.
                    </p>
                </div>
                <Link
                    href="/create"
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Create New Poll
                </Link>
            </motion.div>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    My Polls
                </h2>
                <PollGrid
                    polls={polls}
                    emptyMessage="You haven't created any polls yet. Start by creating your first poll!"
                />
            </section>
        </div>
    );
}
