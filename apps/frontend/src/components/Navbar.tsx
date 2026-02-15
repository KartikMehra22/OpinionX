"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
    const { user, login, logout, loading } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            OpinionX
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="flex items-center space-x-4">
                        {!loading && (
                            <>
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <UserIcon size={18} />
                                                )}
                                            </div>
                                            <span className="hidden md:block font-medium text-gray-700">{user.name}</span>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href="/login" className="px-4 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
