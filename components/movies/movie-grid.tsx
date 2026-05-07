"use client";

import React, { useEffect, useState } from "react";
import { fetchLatestSafeMovies, Movie } from "@/app/api/MoviesData";
import { MovieCard } from "./movie-card";
import { Film, RefreshCw, AlertCircle } from "lucide-react";
import { useMovieCache } from "@/contexts/MovieCacheContext";
import { motion, AnimatePresence } from "framer-motion";

interface MovieGridProps {
  selectedGenre: string;
  selectedRating: string;
}

// Simple in-memory session cache to avoid redundant network calls
let sessionCache: Movie[] | null = null;

const MovieGrid: React.FC<MovieGridProps> = ({ selectedGenre, selectedRating }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setApiLimitReached } = useMovieCache();

  useEffect(() => {
    const load = async () => {
      if (sessionCache) {
        setMovies(sessionCache);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // Fetch a robust set of 24 latest movies to ensure plenty of matches across categories
        const latest = await fetchLatestSafeMovies(24);
        sessionCache = latest;
        setMovies(latest);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setApiLimitReached(true);
        }
        setError("Failed to fetch latest movies");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "All" ||
      movie.Genre.toLowerCase().includes(selectedGenre.toLowerCase());
    
    const matchesRating =
      selectedRating === "All" ||
      movie.Rated.toLowerCase() === selectedRating.toLowerCase();

    return matchesGenre && matchesRating;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-gray-800/40 border border-gray-800 animate-pulse">
            <div className="aspect-[2/3] bg-gray-750" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-750 rounded w-3/4" />
              <div className="h-3 bg-gray-750 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500 bg-gray-800/10 border border-gray-850 rounded-2xl">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
          <RefreshCw size={11} className="text-cyan-500 animate-spin-slow" />
          Showing {filteredMovies.length} of {movies.length} family-safe titles
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredMovies.length === 0 ? (
          <motion.div
            key="empty-grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500 bg-gray-800/10 border border-gray-800/60 rounded-3xl"
          >
            <Film className="h-10 w-10 text-gray-600" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white">No matches found</p>
              <p className="text-xs text-gray-500 mt-1">
                Try broadening your filters (e.g., set rating or genre to &quot;All&quot;)
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid-list"
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.imdbID}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.04, 0.25),
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <MovieCard
                  title={movie.Title}
                  year={movie.Year}
                  image={movie.Poster || ""}
                  href={`/movies/${movie.imdbID}`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieGrid;
