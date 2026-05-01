"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CircleEllipsis, ChevronLeft, ChevronRight } from "lucide-react";
import { useMovieCache } from "@/contexts/MovieCacheContext";
import { improvePosterQuality } from "@/app/api/MoviesData";
import Link from "next/link";
import { Movie } from "@/app/api/MoviesData";
import { FavoritesButton } from "@/components/movies/favorites-button";

const SLIDE_INTERVAL = 6000;

const movieNames = [
  "Flow", "Brave", "The Lion King", "Frozen", "Toy Story",
  "Finding Nemo", "Harry Potter and the Sorcerer's Stone",
  "The Incredibles", "Kung Fu Panda", "Up",
];

function getRandomTitles(source: string[], count: number) {
  const arr = [...source];
  for (let i = 0; i < arr.length; i++) {
    const j = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

const CACHE_KEY = "movie-slider-data";
const RANDOM_SELECTION_KEY = "movie-slider-selection";

function MovieSlider() {
  const { getMovie, getComponentData, setComponentData } = useMovieCache();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const cachedMovies = getComponentData<Movie[]>(CACHE_KEY);
      const cachedSelection = getComponentData<string[]>(RANDOM_SELECTION_KEY);
      if (cachedMovies && cachedSelection) {
        setMovies(cachedMovies);
        setLoading(false);
        return;
      }
      try {
        const randomMovies = getRandomTitles(movieNames, movieNames.length);
        setComponentData(RANDOM_SELECTION_KEY, randomMovies);
        const fetched = await Promise.all(randomMovies.map((n) => getMovie(n)));
        const valid = fetched.filter((m): m is Movie => m !== null);
        if (valid.length === 0) {
          setError("No valid movies found");
        } else {
          setMovies(valid);
          setComponentData(CACHE_KEY, valid);
        }
      } catch {
        setError("Error loading movies");
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, [getMovie, getComponentData, setComponentData]);

  const nextSlide = useCallback(() => {
    if (movies.length > 0) {
      setCurrentIndex((i) => (i + 1) % movies.length);
      setProgress(0);
    }
  }, [movies.length]);

  const prevSlide = () => {
    if (movies.length > 0) {
      setCurrentIndex((i) => (i - 1 + movies.length) % movies.length);
      setProgress(0);
    }
  };

  // Auto-advance + progress bar
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => nextSlide(), SLIDE_INTERVAL);
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / (SLIDE_INTERVAL / 100)), 100));
    }, 100);
    return () => { clearInterval(interval); clearInterval(progressInterval); };
  }, [movies.length, nextSlide, currentIndex]);

  if (loading) {
    return (
      <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden bg-gray-800 animate-pulse">
        <div className="absolute bottom-8 left-8 space-y-3">
          <div className="h-6 w-32 bg-gray-700 rounded-full" />
          <div className="h-10 w-72 bg-gray-700 rounded-lg" />
          <div className="h-4 w-96 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (error || movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-800 rounded-2xl text-gray-500">
        {error || "No movies available"}
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl group">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[400px] md:h-[480px] w-full"
        >
          <Image
            className="object-cover object-center"
            src={improvePosterQuality(currentMovie.Poster || "")}
            alt={`${currentMovie.Title} Poster`}
            fill
            priority
            unoptimized
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />

          {/* Favorites button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <FavoritesButton
              movie={{
                imdbID: currentMovie.imdbID,
                Title: currentMovie.Title,
                Poster: currentMovie.Poster,
                Year: currentMovie.Year,
                imdbRating: currentMovie.imdbRating,
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl"
          >
            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {currentMovie.Genre?.split(", ").slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-xs font-medium text-gray-200"
                >
                  {genre}
                </span>
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white leading-tight">
              {currentMovie.Title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-5 line-clamp-2 leading-relaxed max-w-xl">
              {currentMovie.Plot}
            </p>
            <Link href={`/movies/${currentMovie.imdbID}`}>
              <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-cyan-500/30 hover:scale-105 text-sm">
                <CircleEllipsis size={16} />
                More Details
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800/60">
        <div
          className="h-full bg-cyan-500 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Arrow controls */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setProgress(0); }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 h-1.5 bg-cyan-400"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSlider;
