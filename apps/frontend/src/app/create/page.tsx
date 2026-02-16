"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreatePoll() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(false);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length >= 8) {
            toast.error("Maximum 8 options allowed");
            return;
        }
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) {
            toast.error("Minimum 2 options required");
            return;
        }
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Enter a poll title");
            return;
        }

        const validOptions = options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            toast.error("Provide at least 2 options");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/api/polls", {
                title,
                description,
                options: validOptions
            });
            toast.success("Poll created!");
            router.push(`/polls/${data.id}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

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
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Create a poll</h1>
                    <p className="text-sm text-gray-400">Ask anything. Get real-time answers.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-xs font-medium text-gray-500 mb-1.5">
                            Question
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's your favorite framework?"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-xs font-medium text-gray-500 mb-1.5">
                            Description <span className="text-gray-300">(optional)</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add context..."
                            rows={2}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
                        />
                    </div>

                    <div className="space-y-2.5">
                        <label className="block text-xs font-medium text-gray-500">
                            Options
                        </label>
                        {options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addOption}
                            className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors mt-1"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Add option
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            "Create Poll"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
