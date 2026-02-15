"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Shield, Plus, Loader2, BarChart } from "lucide-react";
import api from "../../utils/api";
import PollGrid from "../../components/PollGrid";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
        } else if (user?.role === "ADMIN") {
            fetchAllPolls();
        }
    }, [user, authLoading]);

    const fetchAllPolls = async () => {
        try {
            const res = await api.get("/api/polls/admin/all-polls");
            setPolls(res.data);
        } catch (error) {
            console.error("Failed to fetch all polls", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    const totalVotes = polls.reduce((acc: number, curr: any) => acc + (curr.totalVotes || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 mb-12 text-white shadow-2xl relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            <Shield size={24} />
                        </div>
                        <span className="font-bold tracking-widest text-sm uppercase opacity-80">Admin Core</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Platform Overview</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <p className="text-white/60 text-sm font-bold uppercase mb-1">Total Active Polls</p>
                            <p className="text-3xl font-black">{polls.length}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <p className="text-white/60 text-sm font-bold uppercase mb-1">Lifetime Votes Cast</p>
                            <p className="text-3xl font-black">{totalVotes.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <p className="text-white/60 text-sm font-bold uppercase mb-1">Platform Status</p>
                            <p className="text-3xl font-black text-green-300">Operational</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </motion.div>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart className="text-indigo-600" />
                        Global Activity Feed
                    </h2>
                </div>
                <PollGrid
                    polls={polls}
                    emptyMessage="The platform is currently quiet. No polls have been created yet."
                />
            </section>
        </div>
    );
}
