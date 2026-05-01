import React, { useEffect, useState } from "react";
import { fetchLatestSafeMovies } from "@/app/api/MoviesData";
import { Movie } from "@/app/api/MoviesData";
import { MovieCard } from "./movie-card";
import { Film, RefreshCw } from "lucide-react";

// No unused CACHE_KEY here

// Simple in-memory session cache (survives re-renders, resets on page refresh)
let sessionCache: Movie[] | null = null;

const MovieGrid: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // Use session cache to avoid re-fetching on re-renders
      if (sessionCache) {
        setMovies(sessionCache);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const latest = await fetchLatestSafeMovies(12);
        sessionCache = latest;
        setMovies(latest);
      } catch (err) {
        setError("Failed to fetch latest movies");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-gray-800 animate-pulse">
            <div className="aspect-[2/3] bg-gray-700" />
            <div className="p-2.5">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-700 rounded w-1/3 mt-1.5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
        <Film className="h-8 w-8" />
        <p className="text-sm">{error || "No movies found"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <RefreshCw size={11} />
          Showing family-safe releases from {new Date().getFullYear() - 1}–{new Date().getFullYear()}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            title={movie.Title}
            year={movie.Year}
            image={movie.Poster || ""}
            href={`/movies/${movie.imdbID}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
