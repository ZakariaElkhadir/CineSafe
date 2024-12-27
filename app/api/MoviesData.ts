import axios from "axios";

interface Request {
  query: {
    query: string;
  };
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => void;
}

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

interface Movie {
  Rated: string;
  [key: string]: any; 
}

function filterSafeMovies(movies: Movie[]): Movie[] {
  const safeRatings = ["G", "PG"];
  return movies.filter(movie => safeRatings.includes(movie.Rated));
}


const predefinedMovieIds = [
  "tt0111161", // The Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0071562", // The Godfather Part II
  "tt0110912", // Pulp Fiction
  "tt0120737", // The Lord of the Rings: The Fellowship of the Ring
  "tt0406375", // Zathura: A Space Adventure
  
];

//function to get random IDs
function getRandomIds(count: number): string[] {
  const shuffled = predefinedMovieIds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// API handler for random suggestions
export const getRandomMovies = async (req: Request, res: Response) => {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  const randomIds = getRandomIds(5); // Fetch 5 random movies

  try {
    // Fetch detailed movie information for each random IMDb ID
    const detailedMovies = await Promise.all(
      randomIds.map((imdbID: string) =>
        axios
          .get(`https://www.omdbapi.com/`, {
            params: {
              apikey: apiKey,
              i: imdbID, // Fetch by IMDb ID
            },
          })
          .then(res => res.data)
      )
    );

    // Filter the detailed movies
    const safeMovies = filterSafeMovies(detailedMovies);

    // Return the filtered movies
    res.status(200).json(safeMovies);
  } catch (error) {
    console.error("error fetching movies: ", error);
    res.status(500).json({ error: "Error fetching movies" });
  }
};


//  if i want to use name to add some suggestion manual 
export const fetchMovieByName = async (name: string) => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
        t: name, // Use the exact movie title
      },
    });
    return response.data; // Returns movie data
  } catch (error) {
    console.error(`Error fetching movie data for ${name}:`, error);
    return null;
  }
};
