"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, Shield } from "lucide-react";

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
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex items-center gap-4 border-r border-gray-200 pr-4">
                                            <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                                Dashboard
                                            </Link>
                                            {user.role === "ADMIN" && (
                                                <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
                                                    <Shield size={14} className="text-indigo-600" />
                                                    Admin
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden shadow-sm">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 object-cover" />
                                                ) : (
                                                    <UserIcon size={18} />
                                                )}
                                            </div>
                                            <span className="hidden md:block font-bold text-gray-800 tracking-tight">{user.name}</span>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
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
