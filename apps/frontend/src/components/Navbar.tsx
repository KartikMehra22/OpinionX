"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="font-extrabold text-xl tracking-tight text-gray-900">
                        Opinion<span className="text-indigo-600">X</span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            All Polls
                        </Link>
                        <Link
                            href="/create"
                            className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Create Poll
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
                    <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        All Polls
                    </Link>
                    <Link
                        href="/create"
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        Create Poll
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
