"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../utils/api";

interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.get("/api/auth/me");
            if (res.data) {
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            // 401 is expected if the user is not logged in
            if (error.response?.status !== 401) {
                console.error("Auth check failed", error);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        // API_BASE logic to ensure we redirect to the right backend
        const isProd = process.env.NODE_ENV === "production";
        const API_BASE = isProd
            ? process.env.NEXT_PUBLIC_BACKEND_SERVER_URL
            : process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL;

        window.location.href = `${API_BASE}/api/auth/google`;
    };

    const logout = async () => {
        try {
            toast("Signing off...", { icon: "🔒" });
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast("Cleaning up session...", { icon: "🧹" });
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await api.post("/api/auth/logout");
            setUser(null);
            toast.success("See you soon! 👋");
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
            toast.error("Failed to log out");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
