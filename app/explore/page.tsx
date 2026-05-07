"use client";

import Slider from "@/components/slider";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Bell, Sparkles, Menu, ShieldAlert, Tag, Filter } from "lucide-react";
import MovieGrid from "../../components/movies/movie-grid";
import { motion } from "framer-motion";

const GENRES = ["All", "Animation", "Comedy", "Adventure", "Family", "Fantasy", "Drama", "Sci-Fi"];
const RATINGS = ["All", "G", "PG", "PG-13"];

function Explore() {
  const [isPopdownVisible, setIsPopdownVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter Selection States
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");

  return (
    <div className="min-h-screen text-white pb-16">
      {/* ─── Top Header ─── */}
      <header className="lg:pl-72 sticky top-0 z-30 bg-[hsl(220,20%,8%)]/95 backdrop-blur-md border-b border-gray-800/80">
        <div className="px-4 md:px-8 py-3.5 flex items-center gap-3 relative min-h-[64px]">
          {/* Mobile Menu */}
          <button
            className={`lg:hidden flex-shrink-0 p-2.5 bg-gray-850 hover:bg-gray-800 border border-gray-700/60 hover:border-cyan-500/40 rounded-xl text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] opacity-100 scale-100 w-10 h-10 flex items-center justify-center ${
              isSearchFocused ? "max-md:opacity-0 max-md:scale-50 max-md:w-0 max-md:-ml-2 max-md:pointer-events-none" : ""
            }`}
            onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
            aria-label="Toggle Menu"
          >
            <Menu size={18} />
          </button>

          {/* Header Title Icon */}
          <div className={`flex items-center gap-2 flex-shrink-0 mr-1 max-md:hidden ${
            isSearchFocused ? "lg:opacity-40" : ""
          }`}>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25 text-cyan-400">
              <Filter size={15} />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Explore</span>
          </div>

          {/* Search bar with AI smart search */}
          <div 
            className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex-1 relative w-full ${
              isSearchFocused 
                ? "max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-[90%] max-md:z-50 max-md:drop-shadow-[0_0_24px_rgba(6,182,212,0.2)]" 
                : ""
            }`}
          >
            <SearchBar 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Notification bell */}
          <div className={`relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] opacity-100 scale-100 flex-shrink-0 ${
            isSearchFocused ? "max-md:opacity-0 max-md:scale-50 max-md:w-0 max-md:pointer-events-none max-md:overflow-hidden" : ""
          }`}>
            <button
              id="notification-btn"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-850 hover:bg-gray-800 border border-gray-700/60 hover:border-gray-600 text-gray-400 hover:text-white transition-all shadow-md"
              onClick={() => setIsPopdownVisible(!isPopdownVisible)}
              aria-label="Notifications"
            >
              <Bell size={16} />
            </button>

            {isPopdownVisible && (
              <div className="absolute right-0 mt-3 w-72 bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-850/40 border-b border-gray-800/80">
                  <p className="text-sm font-bold text-white">Notifications</p>
                </div>
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-600 bg-gray-900/40">
                  <Bell className="w-8 h-8 text-gray-700 animate-pulse" />
                  <p className="text-xs font-semibold">No notifications yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="lg:pl-72 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Featured Slider */}
          <Slider />

          {/* Interactive Catalog Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Browse Safe Movies
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Click filter chips below to filter the pre-verified safe movie feed instantly.
                </p>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1.5 bg-gray-800/40 border border-gray-750 px-3.5 py-1.5 rounded-full w-fit">
                <Sparkles size={13} className="text-cyan-400" />
                AI Family rating checkmark guaranteed
              </span>
            </div>

            {/* ─── Interactive Chip Filter System ─── */}
            <div className="space-y-4 bg-gray-900/30 border border-gray-800/50 p-5 rounded-3xl backdrop-blur-sm">
              
              {/* Genre Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[70px] max-md:hidden">
                  <Tag size={12} className="text-gray-500" />
                  Genre:
                </div>
                {/* Horizontal scrollable pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent flex-1 scroll-smooth">
                  {GENRES.map((genre) => {
                    const isSelected = selectedGenre === genre;
                    return (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                          isSelected
                            ? "bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/20 scale-[1.03]"
                            : "bg-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-750/60"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safety Rating Selector */}
              <div className="flex items-center gap-3 border-t border-gray-800/50 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[70px] max-md:hidden">
                  <ShieldAlert size={12} className="text-gray-500" />
                  Rating:
                </div>
                {/* Horizontal scrollable pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent flex-1 scroll-smooth">
                  {RATINGS.map((rating) => {
                    const isSelected = selectedRating === rating;
                    return (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                          isSelected
                            ? "bg-teal-500 text-gray-950 shadow-lg shadow-teal-500/20 scale-[1.03]"
                            : "bg-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-750/60"
                        }`}
                      >
                        {rating === "All" ? "All Safety Levels" : `${rating} (Verified)`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dynamic Movie Grid results */}
            <MovieGrid
              selectedGenre={selectedGenre}
              selectedRating={selectedRating}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
