"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieCache } from "@/contexts/MovieCacheContext";
import { Movie, improvePosterQuality } from "@/app/api/MoviesData";
import {
  Baby,
  Smile,
  Compass,
  GraduationCap,
  Laugh,
  Sparkles,
  Milestone,
  Heart,
  ChevronRight,
  Star,
  Calendar,
  Film,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FavoritesButton } from "./favorites-button";

// A detailed map of top family masterpieces tailored for age + vibe combinations.
const MOVIE_MATRICES: Record<string, Record<string, string[]>> = {
  toddler: {
    laugh: ["Despicable Me", "Minions", "Monsters, Inc."],
    magic: ["Finding Nemo", "Frozen", "The Lion King"],
    inspiring: ["Moana", "Up", "WALL-E"],
    family: ["Paddington", "The Many Adventures of Winnie the Pooh", "Babe"],
  },
  kid: {
    laugh: ["Shrek", "The Mitchells vs. the Machines", "Kung Fu Panda"],
    magic: ["Spirited Away", "Inside Out", "Ratatouille"],
    inspiring: ["Brave", "How to Train Your Dragon", "Zootopia"],
    family: ["Home Alone", "Matilda", "The Iron Giant"],
  },
  tween: {
    laugh: ["Night at the Museum", "Zathura: A Space Adventure", "Elf"],
    magic: ["Harry Potter and the Sorcerer's Stone", "Coco", "Enchanted"],
    inspiring: ["Hugo", "Akeelah and the Bee", "Wonder"],
    family: ["The Karate Kid", "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", "E.T. the Extra-Terrestrial"],
  },
  teen: {
    laugh: ["Back to the Future", "Spider-Man: Into the Spider-Verse", "The Princess Bride"],
    magic: ["Harry Potter and the Deathly Hallows: Part 2", "Avatar", "Spider-Man: Across the Spider-Verse"],
    inspiring: ["Hidden Figures", "The Pursuit of Happyness", "Soul"],
    family: ["Little Women", "The Blind Side", "We Bought a Zoo"],
  },
};

const AGES = [
  { id: "toddler", label: "Toddlers (3-5)", icon: Baby, desc: "Simple & delightful" },
  { id: "kid", label: "Kids (6-9)", icon: Smile, desc: "Action & animated magic" },
  { id: "tween", label: "Tweens (10-12)", icon: Compass, desc: "Engaging storyworlds" },
  { id: "teen", label: "Teens (13+)", icon: GraduationCap, desc: "More mature themes" },
];

const VIBES = [
  { id: "laugh", label: "Laugh Out Loud", icon: Laugh, desc: "Pure comedy & fun" },
  { id: "magic", label: "Magical Worlds", icon: Sparkles, desc: "Fantasy & wonders" },
  { id: "inspiring", label: "Inspiring Journeys", icon: Milestone, desc: "Heartfelt adventure" },
  { id: "family", label: "Family Bond", icon: Heart, desc: "Cozy lessons & love" },
];

export default function FamilyMovieMatcher() {
  const { getMovie } = useMovieCache();
  const [selectedAge, setSelectedAge] = useState<string>("kid");
  const [selectedVibe, setSelectedVibe] = useState<string>("magic");
  const [matchedMovies, setMatchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatchedMovies = async (age: string, vibe: string) => {
    setIsLoading(true);
    try {
      const titles = MOVIE_MATRICES[age]?.[vibe] || [];
      const moviePromises = titles.map((title) => getMovie(title));
      const results = await Promise.all(moviePromises);
      const validMovies = results.filter((m): m is Movie => m !== null);
      setMatchedMovies(validMovies);
    } catch (err) {
      console.error("Error matching movies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedMovies(selectedAge, selectedVibe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAge, selectedVibe]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-10">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
          <Sparkles className="text-cyan-400 h-6 w-6" />
          Family Movie Matcher
        </h2>
        <p className="text-gray-400 mt-2 max-w-xl text-sm leading-relaxed">
          Select your child&apos;s age and desired vibe, and let our interactive AI system recommend rated masterpieces rated G, PG, or PG-13.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Age Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              1. Who is watching?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGES.map((age) => {
                const Icon = age.icon;
                const isSelected = selectedAge === age.id;
                return (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/5 scale-[1.02]"
                        : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-700/40 text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{age.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{age.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vibe Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              2. What is the vibe?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VIBES.map((vibe) => {
                const Icon = vibe.icon;
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                      isSelected
                        ? "bg-teal-500/10 border-teal-500 text-teal-400 shadow-lg shadow-teal-500/5 scale-[1.02]"
                        : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? "bg-teal-500/20 text-teal-400" : "bg-gray-700/40 text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{vibe.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{vibe.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 bg-gray-800/20 border border-gray-800 rounded-3xl p-6 min-h-[360px] flex flex-col justify-center relative overflow-hidden backdrop-blur-sm">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-16"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin" />
                  <Loader2 className="h-5 w-5 text-cyan-400 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Matching safety data...</p>
                  <p className="text-xs text-gray-500 mt-1">Sourcing G/PG ratings for the perfect match</p>
                </div>
              </motion.div>
            ) : matchedMovies.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center text-gray-500 space-y-3"
              >
                <Film className="h-10 w-10 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-white">No custom matches cached</p>
                  <p className="text-xs text-gray-500 mt-1">Try toggling to a different age or vibe category!</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <Star size={12} className="fill-cyan-400" />
                    Top Personalized Recommendations
                  </p>
                  <button
                    onClick={() => fetchMatchedMovies(selectedAge, selectedVibe)}
                    className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                    aria-label="Refresh results"
                  >
                    <RefreshCw size={11} />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matchedMovies.map((movie, index) => (
                    <motion.div
                      key={movie.imdbID}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      className="group bg-gray-900/60 border border-gray-800/80 hover:border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col h-full relative"
                    >
                      {/* Poster */}
                      <div className="relative h-44 w-full overflow-hidden bg-gray-800 flex-shrink-0">
                        {movie.Poster && movie.Poster !== "N/A" ? (
                          <Image
                            src={improvePosterQuality(movie.Poster)}
                            alt={movie.Title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 20vw"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-800">
                            <Film className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />

                        {/* Rating Checkmark */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                          <span className="text-[10px] text-cyan-400 font-extrabold tracking-wider">
                            {movie.Rated === "G" ? "G" : movie.Rated === "PG" ? "PG" : "PG-13"}
                          </span>
                        </div>

                        {/* Favorite Heart Button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FavoritesButton
                            movie={{
                              imdbID: movie.imdbID,
                              Title: movie.Title,
                              Poster: movie.Poster,
                              Year: movie.Year,
                              imdbRating: movie.imdbRating,
                            }}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-sm text-white truncate group-hover:text-cyan-400 transition-colors">
                            {movie.Title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-0.5 text-xs text-gray-400">
                              <Calendar size={10} />
                              <span>{movie.Year}</span>
                            </div>
                            {movie.imdbRating && movie.imdbRating !== "N/A" && (
                              <div className="flex items-center gap-0.5 text-xs text-amber-400">
                                <Star size={10} className="fill-amber-400" />
                                <span>{movie.imdbRating}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <Link href={`/movies/${movie.imdbID}`}>
                            <button className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-white bg-gray-800 hover:bg-cyan-500/20 hover:text-cyan-400 border border-gray-700/60 hover:border-cyan-500/30 px-2 py-1.5 rounded-xl transition-all duration-200">
                              Full Safety Report
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
