"use client";
import Slider from "@/components/slider";
import { SearchBar } from "@/components/search-bar";
import  Footer  from "@/components/Footer";
import SideBar from "@/components/sideBar";
import {
  Bell,
  ArrowDown,  
} from "lucide-react";
import MovieGrid from "../../components/movies/movie-grid";
function explore() {
  return (
    <>
      {/* Search bar */}
      <header>
        <div className="p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        <div className="header__list">
            <button className="w-16 h-9 flex items-center justify-center bg-gray-800 text-white rounded-full ml-12">
            All <ArrowDown />
            </button>
        </div>
        <SearchBar />
        <div className="Header__notification">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white">
            <Bell className="rounded-full" />
          </button>
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
      <Footer />
    </>
  );
}

export default explore;
