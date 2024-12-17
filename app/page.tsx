import React from 'react';
import { Search, Bell, PlayCircle } from 'lucide-react';
import MovieCategories from '@/components/movies/movieCategories';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-cyan-400">CineSafe</h1>
          <a href="#" className="hover:text-cyan-400">Home</a>
          <a href="#" className="hover:text-cyan-400">Explore</a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search films..."
              className="pl-10 pr-4 py-2 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <Bell className="h-6 w-6 text-gray-400 hover:text-cyan-400 cursor-pointer" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center" />
        <div className="relative z-20 flex flex-col justify-center h-full px-8 max-w-3xl">
          <h2 className="text-5xl font-bold mb-4">Welcome to CineSafe</h2>
          <p className="text-xl mb-6">Discover and enjoy family-friendly animated films in a safe, curated environment.</p>
          <button className="flex items-center space-x-2 bg-cyan-500 text-white px-6 py-3 rounded-full w-fit hover:bg-cyan-600 transition-colors">
            <PlayCircle className="h-5 w-5" />
            <span>Start Watching</span>
          </button>
        </div>
      </div>

      {/* Featured Categories */}
     <MovieCategories />

      {/* Continue Watching */}
      <div className="px-8 py-12 bg-gray-800">
        <h3 className="text-2xl font-bold mb-6">Continue Watching</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-[url('/api/placeholder/300/169')] bg-cover bg-center group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;