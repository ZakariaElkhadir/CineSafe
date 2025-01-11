"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { fetchMovieByName } from "@/app/api/MoviesData";
import { Movie } from "@/app/api/MoviesData";
import Link from "next/link";
import Image from "next/image";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query) {
        try {
          const fetchedMovie = await fetchMovieByName(query);
          if (fetchedMovie) {
            setMovie(fetchedMovie);
            setError("");
            setIsPanelOpen(true);
          } else {
            setError("No safe movie found with that name.");
            setMovie(null);
            setIsPanelOpen(true);
          }
        } catch (err) {
          setError("An error occurred while fetching data.");
          console.error(err);
          setIsPanelOpen(true);
        }
      } else {
        setMovie(null);
        setError("");
        setIsPanelOpen(false);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

  return (
    <div className="relative flex-grow" ref={searchPanelRef}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for a movie..."
          className="pl-3 pr-10  w-56 lg:w-[25rem] bg-gray-800 rounded-3xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          <Search className="h-4 w-4 text-gray-200" />
        </button>
      </div>

      {/* Display search results or error */}
      {isPanelOpen && (movie || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-10">
          {error && <p className="text-red-500 p-2">{error}</p>}
          {movie && (
            <Link href={`/movies/${movie.imdbID}`}>
              <div className="p-4 cursor-pointer hover:bg-gray-700">
                <h2 className="text-lg font-semibold text-white">
                  {movie.Title}
                </h2>
                <p className="text-sm text-gray-400">{movie.Year}</p>
                {movie.Poster && (
                  <Image
                    width={128}
                    height={192}
                    src={movie.Poster}
                    alt={`${movie.Title} Poster`}
                    className="w-32 h-48 object-cover mt-2 rounded-lg"
                  />
                )}
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
