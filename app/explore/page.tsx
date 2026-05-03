"use client";
import Slider from "@/components/slider";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Bell, ChevronDown, Sparkles, Menu } from "lucide-react";
import MovieGrid from "../../components/movies/movie-grid";

const options = ["All", "Movies", "Animation", "Comedy", "Adventure"];

function Explore() {
  const [isPopdownVisible, setIsPopdownVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="min-h-screen text-white">
      {/* ─── Top Header ─── */}
      <header className="lg:pl-72 sticky top-0 z-30 bg-[hsl(220,20%,8%)]/90 backdrop-blur-md border-b border-gray-800/60">
        <div className="px-4 md:px-8 py-3 flex items-center gap-3 relative min-h-[60px]">
          {/* Mobile Menu */}
          <button
            className={`lg:hidden flex-shrink-0 p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/40 rounded-full text-white transition-all duration-300 opacity-100 scale-100 w-9 h-9 flex items-center justify-center ${
              isSearchFocused ? "max-md:opacity-0 max-md:scale-50 max-md:w-0 max-md:-ml-2 max-md:pointer-events-none" : ""
            }`}
            onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
            aria-label="Toggle Menu"
          >
            <Menu size={18} />
          </button>

          {/* Filter dropdown */}
          <div className={`relative transition-all duration-300 opacity-100 scale-100 flex-shrink-0 ${
            isSearchFocused ? "max-md:opacity-0 max-md:scale-50 max-md:w-0 max-md:pointer-events-none max-md:overflow-hidden" : ""
          }`}>
            <button
              id="filter-dropdown-btn"
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/40 text-white text-sm rounded-full transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedOption}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-10 lg:left-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-1 z-50">
                {options.map((opt) => (
                  <button
                    key={opt}
                    className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                      selectedOption === opt
                        ? "text-cyan-400 bg-cyan-500/10"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => { setSelectedOption(opt); setIsDropdownOpen(false); }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div 
            className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-1 relative w-full ${
              isSearchFocused 
                ? "max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-[85%] max-md:z-50 max-md:drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
                : ""
            }`}
          >
            <SearchBar 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Notification bell */}
          <div className={`relative transition-all duration-300 opacity-100 scale-100 flex-shrink-0 ${
            isSearchFocused ? "max-md:opacity-0 max-md:scale-50 max-md:w-0 max-md:pointer-events-none max-md:overflow-hidden" : ""
          }`}>
            <button
              id="notification-btn"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-all"
              onClick={() => setIsPopdownVisible(!isPopdownVisible)}
              aria-label="Notifications"
            >
              <Bell size={16} />
            </button>

            {isPopdownVisible && (
              <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                </div>
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-600">
                  <Bell className="w-8 h-8" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="lg:pl-72 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <Slider />

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Browse Movies</h2>
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-400" />
                AI-powered family-safe curation
              </span>
            </div>
            <MovieGrid />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
