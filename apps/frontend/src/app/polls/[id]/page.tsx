"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../utils/api";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Option {
    id: number;
    text: string;
    voteCount: number;
}

interface Poll {
    id: number;
    title: string;
    description?: string;
    created_at: string;
    creator: {
        name: string;
        avatar?: string;
    };
    options: Option[];
    totalVotes: number;
}

export default function PollDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState<number | null>(null); // Option ID being voted on

    useEffect(() => {
        fetchPoll();
    }, [id]);

    const fetchPoll = async () => {
        try {
            const { data } = await api.get(`/api/polls/${id}`);
            setPoll(data);
        } catch (error) {
            console.error("Failed to fetch poll", error);
            toast.error("Failed to load poll");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionId: number) => {
        if (!user) {
            toast.error("Please sign in to vote");
            router.push("/login");
            return;
        }

        setVoting(optionId);
        try {
            await api.post(`/api/polls/${id}/vote`, { optionId });
            toast.success("Vote recorded!");
            await fetchPoll(); // Refresh data to show new counts
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to vote");
        } finally {
            setVoting(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
    if (!poll) return <div className="text-center py-20">Poll not found</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12"
                >
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                {poll.creator.name[0]}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{poll.title}</h1>
                                <p className="text-sm text-gray-500">Posted by {poll.creator.name}</p>
                            </div>
                        </div>
                        {poll.description && (
                            <p className="text-gray-600 leading-relaxed mb-6">{poll.description}</p>
                        )}
                        <div className="text-sm font-medium text-gray-400">
                            {poll.totalVotes} votes
                        </div>
                    </div>

                    <div className="space-y-4">
                        {poll.options.map((option) => {
                            const percentage = poll.totalVotes > 0
                                ? Math.round((option.voteCount / poll.totalVotes) * 100)
                                : 0;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleVote(option.id)}
                                    disabled={!!voting}
                                    className="relative w-full text-left group overflow-hidden rounded-xl border-2 border-gray-100 hover:border-black transition-all duration-200"
                                >
                                    {/* Progress Bar Background */}
                                    <div
                                        className="absolute top-0 left-0 bottom-0 bg-gray-50 transition-all duration-500 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    />

                                    <div className="relative p-4 flex justify-between items-center z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${voting === option.id ? 'border-black' : 'border-gray-300 group-hover:border-black'}`}>
                                                {voting === option.id && <Loader2 className="w-3 h-3 animate-spin text-black" />}
                                            </div>
                                            <span className="font-medium text-gray-900">{option.text}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                                            <span className="text-xs text-gray-500 w-12 text-right">{option.voteCount} votes</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
