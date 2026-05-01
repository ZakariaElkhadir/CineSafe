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
  page = 1,
  year?: number
): Promise<SearchResponse> => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        s: query,
        type: "movie",
        page,
        ...(year ? { y: year } : {}),
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
 * Fetches latest family-safe movies by searching OMDB with broad terms
 * filtered to the current and previous year.
 * Deduplicates results and checks each movie's rating.
 */
export const fetchLatestSafeMovies = async (
  limit = 12
): Promise<Movie[]> => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];
  // Broad terms that appear in many movie titles — cast a wide net
  const searchTerms = ["the", "adventure", "little", "super", "magic"];

  const seenIds = new Set<string>();
  const candidates: SearchResult[] = [];

  // Search each term × year in parallel
  const searchJobs = years.flatMap((year) =>
    searchTerms.map((term) => searchMovies(term, 1, year))
  );
  const searchResults = await Promise.allSettled(searchJobs);

  for (const result of searchResults) {
    if (result.status !== "fulfilled") continue;
    for (const movie of result.value.results) {
      if (!seenIds.has(movie.imdbID)) {
        seenIds.add(movie.imdbID);
        candidates.push(movie);
      }
    }
  }

  // Fetch full details for all candidates in parallel, then filter safe ones
  const detailResults = await Promise.allSettled(
    candidates.slice(0, limit * 3).map((m) => fetchMovieById(m.imdbID))
  );

  const safeMovies: Movie[] = [];
  for (const r of detailResults) {
    if (r.status === "fulfilled" && r.value) {
      safeMovies.push(r.value);
      if (safeMovies.length >= limit) break;
    }
  }

  return safeMovies;
};

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
