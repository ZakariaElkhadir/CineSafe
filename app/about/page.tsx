"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Star, Search, Heart, Compass, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Family-Safe Ratings",
    desc: "Only G, PG, and PG-13 movies make it through our filter — so you can browse with confidence.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Star,
    title: "Curated Quality",
    desc: "Ratings from IMDB help surface the best-reviewed family films, not just any title.",
    color: "from-amber-500 to-orange-400",
  },
  {
    icon: Search,
    title: "Smart Search",
    desc: "Find any movie instantly. Our search shows multiple results so you always land on the right one.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    desc: "Bookmark movies you love and access them anytime from your personal Favorites list.",
    color: "from-rose-500 to-pink-500",
  },
];

const faqs = [
  {
    q: "Does CineSafe stream movies?",
    a: "No. CineSafe is a discovery tool — it gives you information about movies so you can decide what to watch and where to find it.",
  },
  {
    q: "What ratings are considered safe?",
    a: "CineSafe includes movies rated G, PG, and PG-13 by the MPAA. These are generally appropriate for family viewing.",
  },
  {
    q: "Where does the movie data come from?",
    a: "All movie data is sourced from the OMDB API, which aggregates information from IMDB and other databases.",
  },
  {
    q: "Are favorites saved forever?",
    a: "Favorites are saved in your browser's local storage, so they persist across visits as long as you don't clear your browser data.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white lg:pl-72 px-4 md:px-12 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium mb-5">
            <Shield size={12} />
            About CineSafe
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Movie discovery that puts{" "}
            <span className="text-gradient-cyan">your family first</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            CineSafe is your trusted platform for finding family-friendly films.
            We filter out anything above PG-13 so you can browse, search, and
            discover great movies without second-guessing every title.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/explore">
              <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 text-sm">
                <Compass size={16} /> Explore Movies
              </button>
            </Link>
            <Link href="/favorites">
              <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 font-medium px-5 py-2.5 rounded-full transition-all text-sm">
                <Heart size={16} /> My Favorites
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-14"
        >
          <h2 className="text-xl font-bold text-white mb-6">What CineSafe offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="p-5 bg-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-gray-600 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="p-5 bg-gray-800/40 border border-gray-700/50 rounded-2xl">
                <div className="flex items-start gap-3">
                  <ChevronRight size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1.5">{q}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
