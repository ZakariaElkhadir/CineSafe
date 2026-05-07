"use client";

import React from "react";
import { Compass, Shield, Sparkles, Film, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import MovieCategories from "@/components/movies/movieCategories";
import FamilyMovieMatcher from "@/components/movies/family-movie-matcher";

const features = [
  {
    icon: Shield,
    title: "Family Safe",
    desc: "Strictly filtered to G, PG & PG-13 only",
    color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/20 text-cyan-400",
  },
  {
    icon: Sparkles,
    title: "AI Smart Search",
    desc: "Intelligent discovery via natural language",
    color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/20 text-cyan-400",
  },
  {
    icon: Compass,
    title: "Curated Lists",
    desc: "Hand-picked ratings by family safety experts",
    color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/20 text-cyan-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
  },
};

const HomePage = () => {
  return (
    <div className="min-h-screen text-white overflow-hidden pb-16">
      <main className="lg:pl-72 pt-0">
        {/* ─── Hero section with floating lights ─── */}
        <div className="relative min-h-[460px] flex items-center justify-center md:justify-start px-6 md:px-12 py-16 overflow-hidden">
          {/* Animated Background Gradients & Blobs */}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,20%,12%)]/20 via-[hsl(220,20%,8%)] to-[hsl(220,20%,8%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-20%,rgba(6,182,212,0.15),transparent_60%)]" />

          {/* Floating Blur Blobs */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 md:right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-10 md:left-1/3 w-96 h-56 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-3xl"
          >
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 mb-6 justify-center md:justify-start">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/5">
                <Shield size={12} />
                Family-Safe Filtering
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/25 rounded-full text-teal-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-500/5 animate-pulse">
                <Sparkles size={12} />
                AI Smart Discovery
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-center md:text-left"
            >
              Find Movies <br className="hidden md:block" />
              <span className="text-gradient-cyan glow-cyan-sm font-black">Your Whole Family</span> <br className="hidden md:block" />
              Will Truly Enjoy.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-gray-400 mb-8 max-w-xl leading-relaxed text-center md:text-left"
            >
              CineSafe leverages advanced safety AI to filter out mature content. Discover amazing G, PG, and PG-13 movies through smart, child-friendly parameters.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/explore">
                <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-gray-950 font-bold px-7 py-3.5 rounded-full transition-all duration-300 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105">
                  <Compass size={18} />
                  Start Exploring
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/about">
                <button className="flex items-center gap-2 bg-gray-900/60 hover:bg-gray-800 text-white border border-gray-800 hover:border-gray-700 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 backdrop-blur-sm">
                  Learn More
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── Redesigned Feature Badges ─── */}
        <div className="px-6 md:px-12 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto md:mx-0">
            {features.map(({ icon: Icon, title, desc, color }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`flex items-start gap-4 p-5 rounded-2xl bg-gray-800/20 border border-gray-800/80 hover:border-cyan-500/30 transition-all duration-300 shadow-md`}
              >
                <div className={`w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 text-cyan-400`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800/50 my-4" />

        {/* ─── Interactive Matcher Quiz Widget ─── */}
        <FamilyMovieMatcher />

        <div className="border-t border-gray-800/50 my-8" />

        {/* ─── Curated Categories Showcase ─── */}
        <div className="mt-6">
          <div className="px-6 md:px-12 mb-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Film size={12} />
              Curated Showcases
            </h3>
          </div>
          <MovieCategories />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
