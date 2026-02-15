"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreatePoll() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(false);

    // Protect route
    if (!authLoading && !user) {
        router.push("/login");
        return null;
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) {
            toast.error("A poll must have at least 2 options");
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a poll title");
            return;
        }

        const validOptions = options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            toast.error("Please provide at least 2 valid options");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/polls", {
                title,
                description,
                options: validOptions
            });
            toast.success("Poll created successfully!");
            router.push(`/polls/${data.id}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;

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
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Poll</h1>
                        <p className="text-gray-500">Ask your community anything.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Question / Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. What's your favorite framework?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add some context..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Options Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Options
                            </label>
                            {options.map((option, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3"
                                >
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </motion.div>
                            ))}

                            <button
                                type="button"
                                onClick={addOption}
                                className="inline-flex items-center text-sm font-medium text-black hover:text-gray-700 transition-colors mt-2"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add another option
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-medium py-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200/50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Creating Poll...
                                </span>
                            ) : (
                                "Create Poll"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
