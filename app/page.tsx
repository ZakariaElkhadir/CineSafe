import React from 'react';
import { PlayCircle } from 'lucide-react';
import MovieCategories from '@/components/movies/movieCategories';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
     
      
      <main className="lg:pl-72 pt-4 px-4"> 
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Hero Section */}
          <div className="relative h-96 overflow-hidden rounded-2xl"> 
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
          <div className="px-8 py-12">
            <h3 className="text-2xl font-bold mb-6">Continue Watching</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </main>
    </div>
  );
};

export default HomePage;