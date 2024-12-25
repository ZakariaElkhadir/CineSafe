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

export const getMovies = async (req: Request, res: Response) => {
  const { query } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
  try {
    const response = await axios.get(`https://www.omdbapi.com/`, {
      params: {
        apikey: apiKey,
        s: query,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("error fetching movies: ", error);
    res.status(500).json({ error: "Error fetching movies" });
  }
};
export const fetchMovieByName = async (name: string) => {
    try {
      const response = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY, // Use your OMDb API key
          t: name, // Use the exact movie title
        },
      });
      return response.data; // Returns movie data
    } catch (error) {
      console.error(`Error fetching movie data for ${name}:`, error);
      return null;
    }
  };