import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import ToastLimiter from "../components/ToastLimiter";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpinionX – Real-Time Polling",
  description: "Create polls, share them instantly, and watch votes roll in live. Built for speed, fairness, and real-time collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#fafafa]`}>
        <ToastLimiter />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#18181b",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
