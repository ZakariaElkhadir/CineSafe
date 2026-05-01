import axios from "axios";

/**
 * CineSafe movie data layer — OMDB API integration.
 * Safe ratings: G, PG, PG-13.
 */

export interface Movie {
  Title: string;
  Year: string;
  Poster?: string;
  Rated: string;
  Genre: string;
  Plot: string;
  imdbID: string;
  imdbRating: string;
  Runtime: string;
  Released: string;
  Director: string;
  BoxOffice?: string;
  Awards: string;
  Actors: string;
  Writer: string;
  Metascore: string;
  Type?: string;
}

export interface SearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
}

const SAFE_RATINGS = ["G", "PG", "PG-13"];

export const improvePosterQuality = (posterUrl: string): string => {
  if (!posterUrl || posterUrl === "N/A") return "/default-poster.jpg";
  return posterUrl.replace("SX300", "SX1000");
};

function isSafeMovie(movie: Movie): boolean {
  return SAFE_RATINGS.includes(movie.Rated);
}

/**
 * Search for movies by keyword — returns up to 10 results per page.
 * Uses OMDB `s` parameter for multi-result search.
 */
export const searchMovies = async (
  query: string,
  page = 1
): Promise<SearchResponse> => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        s: query,
        type: "movie",
        page,
      },
    });

    if (response.data.Response === "False") {
      return { results: [], totalResults: 0 };
    }

    const results: SearchResult[] = response.data.Search || [];
    const totalResults = parseInt(response.data.totalResults || "0", 10);

    return { results, totalResults };
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], totalResults: 0 };
  }
};

/**
 * Fetch a single movie by exact title.
 * Only returns the movie if it has a safe rating (G, PG, PG-13).
 */
export const fetchMovieByName = async (name: string): Promise<Movie | null> => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        t: name,
      },
    });

    const movie = response.data;

    if (movie.Response === "False") return null;

    if (isSafeMovie(movie)) {
      return movie;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};

/**
 * Fetch full movie details by IMDb ID.
 * Only returns the movie if it has a safe rating (G, PG, PG-13).
 */
export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        i: id,
        plot: "full",
      },
    });

    const movie = response.data;

    if (movie.Response === "False") return null;

    if (isSafeMovie(movie)) {
      return movie;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
