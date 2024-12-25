import { MovieCard } from "./movie-card"
import React, { useEffect, useState } from 'react';
import { fetchMovieByName } from '../../app/api/MoviesData';

interface MovieData {
  title: string;
  image: string;
  href: string;
  key : string;
}

const MovieGrid: React.FC = () => {
  const movieNames = ["Inception", "The Matrix", "Interstellar", 'zathura'];
  const [movieData, setMovieData] = useState<MovieData[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await Promise.all(
        movieNames.map(async (name) => {
          const movieDetails = await fetchMovieByName(name);
          return {
            title: name,
            image: movieDetails?.Poster || '',
            href: `/movies/${name.replace(/\s+/g, '-').toLowerCase()}`,
            key: name,
          };
        })
      );
      setMovieData(data);
    };

    fetchImages();
  }, [movieNames]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movieData.map((movie) => (
          <div key={movie.key} className="transform transition duration-300 hover:scale-105">
            <MovieCard
              key={movie.key}
              title={movie.title}
              image={movie.image}
              href={movie.href}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;