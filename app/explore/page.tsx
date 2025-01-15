"use client";
import Slider from "@/components/slider";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Bell, ArrowDown } from "lucide-react";
import MovieGrid from "../../components/movies/movie-grid";
function Explore() {
  const [isPopdownVisible, setIsPopdownVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const options = ["All", "Movies", "TV Shows", "Animation"];

  return (
    <>
      {/* Search bar */}
      <header>
        <div className="p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="header__list">
              <div className="relative">
                <button
                  className="w-auto px-2 h-9 flex items-center justify-center bg-gray-800 text-white rounded-full ml-12 hover:bg-gray-700 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedOption} <ArrowDown className="ml-1" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-24 rounded-lg bg-gray-800 shadow-lg py-1 ml-12">
                    {options.map((option) => (
                      <button
                        key={option}
                        className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 text-left transition-colors"
                        onClick={() => {
                          setSelectedOption(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow mx-4">
              {" "}
              <SearchBar />
            </div>
            <div className="Header__notification">
              <div className="relative">
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white 
      hover:bg-gray-700 transition-colors relative group overflow-hidden"
                  onClick={() => setIsPopdownVisible(!isPopdownVisible)}
                >
                  <Bell className="rounded-full" />
                  <span className="absolute inset-0 border-2 border-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100"></span>
                </button>

                {isPopdownVisible && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 px-4 
                   text-sm text-gray-600 border border-gray-200 z-10"
                  >
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          No notifications at this time
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <div className="flex text-center">
        {/* Main content */}
        <main className="flex-1  lg:pl-72 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="">
              <div className="w-full">
                <Slider />
                <MovieGrid />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Explore;
