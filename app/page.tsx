import React from "react";
import { Compass, Shield, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import MovieCategories from "@/components/movies/movieCategories";

const features = [
  {
    icon: Shield,
    title: "Family Safe",
    desc: "Filtered to G, PG & PG-13 only",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Star,
    title: "Top Rated",
    desc: "Curated by IMDB ratings",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "All Genres",
    desc: "Animation, adventure, comedy & more",
    color: "from-purple-500 to-pink-500",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen text-white">
      <main className="lg:pl-72 pt-0">
        {/* ─── Hero ─── */}
        <div className="relative min-h-[420px] flex items-center overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[hsl(220,20%,10%)] to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,200,220,0.12),transparent)]" />
          {/* Decorative blobs */}
          <div className="absolute top-10 right-16 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-teal-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 px-6 md:px-12 py-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium mb-6">
              <Shield size={12} />
              Family-safe movie discovery
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
              Find movies{" "}
              <span className="text-gradient-cyan">your whole family</span>{" "}
              will love
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              CineSafe curates G, PG & PG-13 films so you can discover great
              content without worrying about what&apos;s in it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/explore">
                <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-cyan-500/30 hover:scale-105">
                  <Compass size={18} />
                  Start Exploring
                </button>
              </Link>
              <Link href="/about">
                <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600 font-medium px-6 py-3 rounded-full transition-all duration-200">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Feature Badges ─── */}
        <div className="px-6 md:px-12 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Movie Categories ─── */}
        <MovieCategories />
      </main>
    </div>
  );
};

export default HomePage;
