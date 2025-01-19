import React from "react";
import { Compass } from "lucide-react";
import Link from "next/link";
import MovieCategories from "@/components/movies/movieCategories";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="lg:pl-72 pt-4 px-4">
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Hero Section */}
          <div className="relative h-96 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center" />
            <div className="relative z-20 flex flex-col justify-center items-center md:items-start h-full px-8 max-w-3xl">
              <h2 className="text-5xl font-bold mb-4 text-center md:text-left">Welcome to CineSafe</h2>
              <p className="text-xl mb-6 text-center md:text-left">
              Discover and enjoy family-friendly animated films in a safe,
              curated environment.
              </p>
              <Link href="/explore" className="mx-auto md:mx-0">
              <button className="flex items-center space-x-2 bg-cyan-500 text-white px-6 py-3 rounded-full w-fit hover:bg-cyan-600 transition-colors">
                <Compass className="h-5 w-5" />
                <span>Start Exploring</span>
              </button>
              </Link>
            </div>
          </div>
          {/* Featured Categories */}
          <MovieCategories />
         
        </div>
      </main>
    </div>
  );
};

export default HomePage;
