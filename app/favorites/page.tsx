"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, Compass, Trash2, Film } from "lucide-react";
import { improvePosterQuality } from "@/app/api/MoviesData";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const { favorites, removeFavorite, totalFavorites } = useFavorites();

  return (
    <div className="min-h-screen text-white lg:pl-72 px-4 md:px-10 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
            <Heart className="h-5 w-5 text-rose-400 fill-rose-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        </div>
        <p className="text-gray-500 text-sm ml-13">
          {totalFavorites === 0
            ? "No favorites saved yet"
            : `${totalFavorites} movie${totalFavorites !== 1 ? "s" : ""} saved`}
        </p>
      </div>

      {/* Empty State */}
      {totalFavorites === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center">
            <Heart className="h-9 w-9 text-gray-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No favorites yet</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Browse movies and click the heart icon to save your favorites here.
            </p>
          </div>
          <Link href="/explore">
            <button className="flex items-center gap-2 mt-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold rounded-full transition-all text-sm hover:scale-105">
              <Compass size={16} />
              Explore Movies
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {favorites.map((movie) => (
              <motion.div
                key={movie.imdbID}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-rose-500/30 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/movies/${movie.imdbID}`}>
                  <div className="relative aspect-[2/3]">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <Image
                        src={improvePosterQuality(movie.Poster)}
                        alt={movie.Title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 20vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-700">
                        <Film className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-medium text-white truncate">{movie.Title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{movie.Year}</p>
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => removeFavorite(movie.imdbID)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/80 text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
