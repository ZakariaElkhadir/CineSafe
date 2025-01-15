import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CircleEllipsis, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMovieByName } from "@/app/api/MoviesData";
import { improvePosterQuality } from "@/app/api/MoviesData";
import Link from "next/link";
import { Movie } from "@/app/api/MoviesData";


// List of movie names to fetch
const movieNames = [
  "Flow",
  "Brave",
  "The Lion King",
  "Frozen",
  "Toy Story",
  "Finding Nemo",
  "Harry Potter and the Sorcerer's Stone",
  "The Avengers",
  "Jurassic Park",
];
function getRandomTitles(source: string[], count: number) {
  return [...source].sort(() => 0.5 - Math.random()).slice(0, count);
}
function MovieSlider() {
  const randomMovies = getRandomTitles(movieNames, 10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const moviePromises = randomMovies.map((name) => fetchMovieByName(name));
        const fetchedMovies = await Promise.all(moviePromises);

        // Filter out null values from the results
        const validMovies = fetchedMovies.filter(
          (movie): movie is Movie => movie !== null
        );

        if (validMovies.length === 0) {
          setError("No valid movies found");
        } else {
          setMovies(validMovies);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Error loading movies");
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  const nextSlide = () => {
    if (movies.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }
  };

  const prevSlide = () => {
    if (movies.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
      );
    }
  };

  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [movies.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-100 rounded-2xl">
        <div className="text-xl">Loading movies...</div>
      </div>
    );
  }

  if (error || movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-100 rounded-2xl">
        <div className="text-xl text-red-500">
          {error || "No movies available"}
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <section className="slider">
      <div className="container relative">
        <div className="slider__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="slider__image relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
              <Image
                className="object-cover object-center w-full h-[480px] rounded-2xl"
                src={improvePosterQuality(currentMovie.Poster || "")}
                alt={`${currentMovie.Title} Movie Poster`}
                width={1000}
                height={480}
                priority
                unoptimized
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 p-8 text-white text-left"
              >
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                  {currentMovie.Genre?.split(", ").map((genre, index) => (
                    <h3
                      key={index}
                      className="px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      {genre}
                    </h3>
                  ))}
                </div>
                <h2 className="slider__title text-6xl font-bold mb-4">
                  {currentMovie.Title}
                </h2>
                <p className="slider__description max-w-2xl mb-6 text-gray-200">
                  {currentMovie.Plot}
                </p>
                <Link href={`/movies/${currentMovie.imdbID}`}>
                  <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-sky-500/50 hover:scale-105">
                    <CircleEllipsis size={20} className="text-white" />
                    <span>More Details</span>
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        {movies.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default MovieSlider;
