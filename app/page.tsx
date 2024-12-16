"use client";
import Slider from "@/components/slider";
import { SearchBar } from "../components/search-bar";
import  Footer  from "../components/Footer";
import {
  Bell,
  ArrowDown,
  Home,
  Compass,
  Film,
  Heart,
  Settings,
} from "lucide-react";
import MovieGrid from "../components/movies/movie-grid";
function page() {
  return (
    <>
      {/* Search bar */}
      <header>
        <div className="p-4 max-w-md mx-auto ">
          <div className="flex items-center justify-between gap-4">
            <div className="header__list">
              <button className="w-16 h-9 flex items-center justify-center bg-gray-800 text-white rounded-full">
                All <ArrowDown />
              </button>
            </div>
            <SearchBar />
            <div className="Header__notification">
              <button className="w-9 h-9 flex items-center justify-center  rounded-full bg-gray-800 text-white">
                <Bell className="rounded-full " />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <div className="flex text-center">
        <nav className="w-64 min-h-screen bg-gray-800 text-white ml-20 -mt-12 rounded-2xl p-6 fixed">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mt-4 mb-2">CineSafe</h1>
            <div className="w-16 h-1 bg-sky-500 mx-auto rounded-full"></div>
          </div>

          <ul className="space-y-6">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Home size={20} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Compass size={20} />
                <span>Explore</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Film size={20} />
                <span>Movies</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Heart size={20} />
                <span>Favorites</span>
              </a>
            </li>
          </ul>

          <div className=" pt-6 border-t border-gray-700 mt-8">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:bg-teal-600 rounded-lg transition-all"
            >
              <Settings size={20} />
              <span>Settings</span>
            </a>
          </div>
        </nav>
         {/* Main content */}
         <main className="flex-1 ml-84 w-96 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="pl-64 ml-16"> 
              <div className="w-full">
                <Slider />
                <MovieGrid />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default page;
