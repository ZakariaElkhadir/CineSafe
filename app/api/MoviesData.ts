import axios from "axios";

/**
 * Fetches movies from the OMDB API based on the provided query parameter.
 * Only movies with safe ratings ("G" and "PG") are considered.
 *
 * @param req - The request object containing the query parameter.
 * @param res - The response object used to send back the fetched movies or an error message.
 *
 * @returns A JSON response with the fetched movies data or an error message.
 *
 * @throws Will throw an error if there is an issue with fetching movies from the OMDB API.
 */

export interface Movie {
  Title: string;
  Year: string;
  Poster?: string;
  Rated: string;
  [key: string]: any;
}

function filterSafeMovies(movies: Movie[]): Movie[] {
  const safeRatings = ["G", "PG"];
  return movies.filter((movie) => safeRatings.includes(movie.Rated));
}

export const fetchMovieByName = async (name: string): Promise<Movie | null> => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        t: name,
      },
    });

    const movie = response.data;

    if (filterSafeMovies([movie]).length > 0) {
      return movie;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};

export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        i: id, // Use the `i` parameter to fetch by ID
      },
    });

    const movie = response.data;

    if (filterSafeMovies([movie]).length > 0) {
      return movie;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
