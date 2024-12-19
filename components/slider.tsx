"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  image: string;
  title: string;
  description: string;
  genres: string[];
}

const movies: Movie[] = [
  {
    image: "/images/flow-movie-poster.webp",
    title: "Flow",
    description:
      "Cat is a solitary animal, but as its home is devastated by a great flood, he finds refuge on a boat populated by various species, and will have to team up with them despite their differences.",
    genres: ["Adventure", "Animation"],
  },
  {
    image: "/images/movies/dr.strange-poster.jpg",
    title: "Dr. Strange",
    description:
      "Dr. Stephen Strange's life changes after a car accident robs him of the use of his hands. When traditional medicine fails him, he looks for healing, and hope, in a mysterious enclave.",
    genres: ["Action", "Fantasy"],
  },
  {
    image: "/images/movies/spiderwick-poster.jpg",
    title: "The Spiderwick Chronicles",
    description:
      "Upon moving into the run-down Spiderwick Estate with their mother, twin brothers Jared and Simon Grace, along with their sister Mallory, find themselves pulled into an alternate world full of faeries and other creatures.",
    genres: ["Adventure", "Family"],
  },
  {
    image: "/images/movies/spiderman-poster.jpg",
    title: "Spider-Man: No Way Home",
    description:
      "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    genres: ["Action", "Adventure"],
  },
  {
    image: "/images/movies/brave-poster.jpg",
    title: "Brave",
    description:
      "Determined to make her own path in life, Princess Merida defies a custom that brings chaos to her kingdom. Granted one wish, Merida must rely on her bravery and her archery skills to undo a beastly curse.",
    genres: ["Adventure", "Animation"],
  },
];

function MovieSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
                src={movies[currentIndex].image}
                alt={`${movies[currentIndex].title} Movie Poster`}
                width={1000}
                height={480}
                priority
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 p-8 text-white text-left"
              >
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                  {movies[currentIndex].genres.map((genre, index) => (
                    <h3
                      key={index}
                      className="px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      {genre}
                    </h3>
                  ))}
                </div>
                <h2 className="slider__title text-6xl font-bold mb-4">
                  {movies[currentIndex].title}
                </h2>
                <p className="slider__description max-w-2xl mb-6 text-gray-200">
                  {movies[currentIndex].description}
                </p>
                <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-sky-500/50 hover:scale-105">
                  <Play size={20} className="text-white" />
                  <span>Watch Movie</span>
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
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
      </div>
    </section>
  );
}

export default MovieSlider;
