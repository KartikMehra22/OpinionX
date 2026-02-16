"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full mb-6 border border-indigo-100">
              <Zap size={12} /> Real-time polling
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Create polls.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Get instant answers.
              </span>
            </h1>

            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Share a link, collect votes, and watch results update live. Simple, fast, and fair.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/create"
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
              >
                Create Poll <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                How it works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Built for real decisions</h2>
            <p className="text-gray-500">Everything you need to run fair, transparent polls.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                color: "bg-amber-50 text-amber-600",
                title: "Live Results",
                desc: "Votes appear instantly via WebSockets. No refresh needed.",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                color: "bg-indigo-50 text-indigo-600",
                title: "Fair Voting",
                desc: "Smart browser checks + database constraints prevent double voting.",
              },
              {
                icon: <BarChart2 className="w-5 h-5" />,
                color: "bg-emerald-50 text-emerald-600",
                title: "Persistent Data",
                desc: "All polls and votes are stored in PostgreSQL. Nothing is lost.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "Real-time", label: "Vote updates" },
              { value: "Anonymous", label: "No sign-up needed" },
              { value: "Persistent", label: "PostgreSQL backed" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-center items-center">
          <span className="text-sm text-gray-400">
            © 2026 OpinionX. Built with Next.js, Express & Socket.io
          </span>
        </div>
      </footer>
    </div>
  );
}
