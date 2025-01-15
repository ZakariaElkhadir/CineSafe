import React, { useEffect, useState } from "react";
import { fetchMovieByName } from "../../app/api/MoviesData";
import { MovieCard } from "./movie-card";

interface MovieData {
  title: string;
  image: string;
  href: string;
  key: string;
}

const allPossibleMovies = [
  "The Chronicles of Narnia: The Voyage of the Dawn Treader",
  "Shrek",
  "Finding Nemo",
  "The Incredibles",
  "Toy Story",
  "Toy Story 2",
  "Monsters, Inc.",
  "Up",
  "Kung Fu Panda",
  "How to Train Your Dragon",
  "The Lego Movie",
  "Frozen",
  "Tangled",
  "Moana",
  "Inside Out",
  "Coco",
];

// Utility to shuffle and pick random items
function getRandomTitles(source: string[], count: number) {
  return [...source].sort(() => 0.5 - Math.random()).slice(0, count);
}

const MovieGrid: React.FC = () => {
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        setIsLoading(true);
        const randomMovies = getRandomTitles(allPossibleMovies, 8);
        const data = await Promise.all(
          randomMovies.map(async (name) => {
            const movie = await fetchMovieByName(name);
            return {
              title: movie?.Title || name,
              image: movie?.Poster || "/default-poster.jpg",
              href: `/movies/${movie?.imdbID || ""}`,
              key: movie?.imdbID || name,
            };
          })
        );
        setMovieData(data);
      } catch (err) {
        setError("Failed to fetch movies");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movieData.map((movie) => (
          <MovieCard
            key={movie.key}
            title={movie.title}
            image={movie.image}
            href={movie.href}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
