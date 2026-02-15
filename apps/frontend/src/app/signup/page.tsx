"use client";

import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Signup() {
    const { login } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join OpinionX and start polling</p>
                </div>

                <button
                    onClick={login}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm mb-6 group"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900">Continue with Google</span>
                </button>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
