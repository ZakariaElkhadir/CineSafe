"use client";

import { Search, Loader2, Film, X, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { searchMovies, SearchResult, improvePosterQuality } from "@/app/api/MoviesData";
import Link from "next/link";
import Image from "next/image";
import { AILoadingHorizontal } from "./ai-loading";
import { useMovieCache } from "@/contexts/MovieCacheContext";

export interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export function SearchBar({ onFocus, onBlur, className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const { setApiLimitReached } = useMovieCache();
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsPanelOpen(false);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(false);

    // If query looks like natural language, use AI search
    const isNaturalLanguage = q.split(" ").length > 3 || 
                             q.toLowerCase().includes("for") || 
                             q.toLowerCase().includes("about") || 
                             q.toLowerCase().includes("like") ||
                             q.toLowerCase().includes("movies");

    if (isNaturalLanguage) {
      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        } else {
          const { results: found } = await searchMovies(q);
          setResults(found);
        }
      } catch {
        const { results: found } = await searchMovies(q);
        setResults(found);
      }
    } else {
      try {
        const { results: found } = await searchMovies(q);
        setResults(found);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setApiLimitReached(true);
        }
      }
    }

    setHasSearched(true);
    setIsPanelOpen(true);
    setIsLoading(false);
    setActiveIndex(-1);
  }, []);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
    }, 450);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isPanelOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setIsPanelOpen(false);
      setActiveIndex(-1);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsPanelOpen(false);
    inputRef.current?.focus();
  };

  const showPanel = isPanelOpen && (isLoading || hasSearched);

  return (
    <div className={`relative flex-grow max-w-lg ${className}`} ref={searchPanelRef}>
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies with AI..."
          className="w-full pl-9 pr-20 py-2 bg-gray-800/80 border border-gray-700 hover:border-cyan-500/50 rounded-full text-sm text-white placeholder-gray-400 transition-all duration-200 neon-border-focus"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { 
            if (hasSearched && results.length > 0) setIsPanelOpen(true); 
            onFocus?.();
          }}
          onBlur={() => {
            onBlur?.();
          }}
          aria-label="Search movies"
          aria-autocomplete="list"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {!query && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] text-purple-400 font-bold tracking-tight">
              <Sparkles size={10} />
              AI
            </span>
          )}
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
          ) : query ? (
            <button onClick={clearSearch} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Results panel */}
      {showPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4">
              <AILoadingHorizontal label="Searching with AI..." />
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-500">
              <Film className="h-8 w-8" />
              <p className="text-sm">No family-safe movies found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              <div className="px-3 py-2 border-b border-gray-800">
                <p className="text-xs text-gray-500">{results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;</p>
              </div>
              <ul className="max-h-[380px] overflow-y-auto divide-y divide-gray-800/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {results.map((movie, idx) => (
                  <li key={movie.imdbID}>
                    <Link
                      href={`/movies/${movie.imdbID}`}
                      onClick={() => { setIsPanelOpen(false); setQuery(""); }}
                    >
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                          activeIndex === idx ? "bg-gray-700" : "hover:bg-gray-800"
                        }`}
                      >
                        {/* Poster */}
                        <div className="relative w-10 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-800">
                          {movie.Poster && movie.Poster !== "N/A" ? (
                            <Image
                              src={improvePosterQuality(movie.Poster)}
                              alt={movie.Title}
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Film className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{movie.Title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">{movie.Year}</span>
                            {movie.Type && (
                              <span className="text-xs px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded capitalize">
                                {movie.Type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
