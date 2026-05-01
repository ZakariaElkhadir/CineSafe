"use client";
import Slider from "@/components/slider";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import MovieGrid from "../../components/movies/movie-grid";

const options = ["All", "Movies", "Animation", "Comedy", "Adventure"];

function Explore() {
  const [isPopdownVisible, setIsPopdownVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  return (
    <div className="min-h-screen text-white">
      {/* ─── Top Header ─── */}
      <header className="lg:pl-72 sticky top-0 z-30 bg-[hsl(220,20%,8%)]/90 backdrop-blur-md border-b border-gray-800/60">
        <div className="px-4 md:px-8 py-3 flex items-center gap-3">
          {/* Filter dropdown */}
          <div className="relative flex-shrink-0">
            <button
              id="filter-dropdown-btn"
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500/40 text-white text-sm rounded-full transition-all duration-200 ml-10 lg:ml-0"
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
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* Notification bell */}
          <div className="relative flex-shrink-0">
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
              <span className="text-sm text-gray-500">Showing family-safe titles</span>
            </div>
            <MovieGrid />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
