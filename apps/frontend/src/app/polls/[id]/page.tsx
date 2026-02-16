"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../utils/api";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ArrowLeft, Share2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001", {
    withCredentials: true,
});

interface Option {
    id: number;
    text: string;
    voteCount: number;
}

interface Poll {
    id: number;
    title: string;
    description?: string;
    createdAt: string;
    options: Option[];
    totalVotes: number;
}

export default function PollDetail() {
    const { id } = useParams();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        fetchPoll();
        socket.emit("joinPoll", id);
        socket.on("voteUpdate", (data) => {
            if (data.pollId === parseInt(id as string)) {
                fetchPoll();
            }
        });
        return () => { socket.off("voteUpdate"); };
    }, [id]);

    useEffect(() => {
        const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");
        if (votedPolls.includes(id)) {
            setHasVoted(true);
        }
    }, [id]);

    const fetchPoll = async () => {
        try {
            const { data } = await api.get(`/api/polls/${id}`);
            setPoll(data);
        } catch (error) {
            console.error("Failed to fetch poll", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
    };

    const handleVote = async (optionId: number) => {
        if (hasVoted) {
            toast.error("You already voted");
            return;
        }

        setVoting(optionId);
        try {
            await api.post(`/api/polls/${id}/vote`, { optionId });
            toast.success("Vote recorded!");
            setHasVoted(true);

            const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "[]");
            if (!votedPolls.includes(id)) {
                localStorage.setItem("votedPolls", JSON.stringify([...votedPolls, id]));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to vote");
            if (error.response?.status === 400 && error.response?.data?.message === "Already voted") {
                setHasVoted(true);
            }
        } finally {
            setVoting(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-gray-300" size={24} />
        </div>
    );

    if (!poll) return (
        <div className="text-center py-24">
            <p className="text-gray-400 mb-4">Poll not found</p>
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-xs text-gray-400 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
            >
                <div>
                    <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 leading-snug">{poll.title}</h1>
                                <p className="text-[11px] text-gray-400">
                                    Posted {new Date(poll.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <button
                                onClick={handleShare}
                                className="p-1.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Copy link"
                            >
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    {poll.description && (
                        <p className="text-sm text-gray-500 mb-4">{poll.description}</p>
                    )}

                    <div className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                        <BarChart2 size={12} />
                        {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
                    </div>
                </div>

                <div className="space-y-2.5">
                    {poll.options.map((option) => {
                        const percentage = poll.totalVotes > 0
                            ? Math.round((option.voteCount / poll.totalVotes) * 100)
                            : 0;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleVote(option.id)}
                                disabled={!!voting || hasVoted}
                                className={`relative w-full text-left overflow-hidden rounded-xl border transition-all duration-200 ${hasVoted
                                    ? "border-gray-100 cursor-default"
                                    : "border-gray-200 hover:border-indigo-300 active:scale-[0.99]"
                                    }`}
                            >
                                <div
                                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${hasVoted ? "bg-indigo-50" : "bg-gray-50"
                                        }`}
                                    style={{ width: `${percentage}%` }}
                                />

                                <div className="relative px-4 py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2.5">
                                        {!hasVoted && (
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${voting === option.id ? "border-indigo-500" : "border-gray-300"
                                                }`}>
                                                {voting === option.id && <Loader2 className="w-2.5 h-2.5 animate-spin text-indigo-500" />}
                                            </div>
                                        )}
                                        {hasVoted && (
                                            <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-medium text-gray-800">{option.text}</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`text-xs font-bold ${hasVoted ? "text-indigo-600" : "text-gray-500"}`}>
                                            {percentage}%
                                        </span>
                                        <span className="text-[10px] text-gray-400 w-10 text-right">
                                            {option.voteCount}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
