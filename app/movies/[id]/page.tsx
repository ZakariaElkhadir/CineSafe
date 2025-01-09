// app/movies/[id]/page.tsx
import { fetchMovieById } from "@/app/api/MoviesData";

export default async function MovieDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Fetch the movie data using the ID
  const movie = await fetchMovieById(id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="pl-80">
      <h1 className="text-2xl font-bold">{movie.Title}</h1>
      <p className="text-lg">{movie.Year}</p>
      {movie.Poster && (
        <img
          src={movie.Poster}
          alt={`${movie.Title} Poster`}
          className="w-48 h-64 object-cover mt-4"
        />
      )}
      <p className="mt-4">{movie.Plot}</p>
    </div>
  );
}
