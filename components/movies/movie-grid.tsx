import React, { useEffect, useState } from "react";
import { useMovieCache } from "@/contexts/MovieCacheContext";
import { MovieCard } from "./movie-card";
import { Film } from "lucide-react";

interface MovieData {
  title: string;
  year: string;
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
  "Ratatouille",
  "Wall-E",
  "Brave",
  "Encanto",
];

function getRandomTitles(source: string[], count: number) {
  return [...source].sort(() => 0.5 - Math.random()).slice(0, count);
}

const CACHE_KEY = "movie-grid-data";

const MovieGrid: React.FC = () => {
  const { getMovie, getComponentData, setComponentData } = useMovieCache();
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      const cachedData = getComponentData<MovieData[]>(CACHE_KEY);
      if (cachedData) {
        setMovieData(cachedData);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const randomMovies = getRandomTitles(allPossibleMovies, 8);
        const data = await Promise.all(
          randomMovies.map(async (name) => {
            const movie = await getMovie(name);
            return {
              title: movie?.Title || name,
              year: movie?.Year || "",
              image: movie?.Poster || "/default-poster.jpg",
              href: `/movies/${movie?.imdbID || ""}`,
              key: movie?.imdbID || name,
            };
          })
        );
        const valid = data.filter((m) => m.href !== "/movies/");
        setMovieData(valid);
        setComponentData(CACHE_KEY, valid);
      } catch (err) {
        setError("Failed to fetch movies");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMovies();
  }, [getMovie, getComponentData, setComponentData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
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

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
        <Film className="h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {movieData.map((movie) => (
        <MovieCard
          key={movie.key}
          title={movie.title}
          year={movie.year}
          image={movie.image}
          href={movie.href}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
