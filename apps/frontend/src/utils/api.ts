import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const API_BASE = isProd
    ? process.env.NEXT_PUBLIC_BACKEND_SERVER_URL
    : process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
