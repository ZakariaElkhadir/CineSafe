"use client"; // Required for client-side interactivity in Next.js 13+

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { fetchMovieByName } from "@/app/api/MoviesData";
import { Movie } from "@/app/api/MoviesData";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null); // Ref for the search panel

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a movie name.");
      setIsPanelOpen(true); // Open the panel to show the error
      return;
    }

    try {
      const fetchedMovie = await fetchMovieByName(query);
      if (fetchedMovie) {
        setMovie(fetchedMovie);
        setError("");
        setIsPanelOpen(true);
      } else {
        setError("No safe movie found with that name.");
        console.log("No safe movie found with that name.");
        setMovie(null);
        setIsPanelOpen(true); // Keep the panel open to show the error
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
      setIsPanelOpen(true); // Keep the panel open to show the error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Close the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false); // Close the panel
      }
    };

    // Add event listener when the panel is open
    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
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
          className="pl-3 pr-10 w-[20rem] bg-gray-800 rounded-3xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 text-gray-200" />
        </button>
      </div>

      {/* Display search results or error */}
      {isPanelOpen && (movie || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-10">
          {error && <p className="text-red-500 p-2">{error}</p>}
          {movie && (
            <div className="p-4">
              <h2 className="text-lg font-semibold">{movie.Title}</h2>
              <p className="text-sm text-gray-400">{movie.Year}</p>
              {movie.Poster && (
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} Poster`}
                  className="w-32 h-48 object-cover mt-2 rounded-lg"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
