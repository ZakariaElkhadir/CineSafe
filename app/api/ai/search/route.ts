import OpenAI from "openai";
import { NextRequest } from "next/server";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "user",
          content: `Translate the following natural language movie search query into a list of 5-8 matching movie titles that are likely family-friendly (rated G, PG, or PG-13).

Query: "${query}"

Respond ONLY with this JSON array of strings, no other text:
["Movie Title 1", "Movie Title 2", ...]`,
        },
      ],
      temperature: 0.1,
      max_tokens: 512,
    });

    const raw = completion.choices[0].message.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const titles: string[] = JSON.parse(cleaned);

    // Now fetch basic details (imdbID, Title, Year, Poster) for each title using OMDB
    const results = await Promise.all(
      titles.map(async (title) => {
        try {
          const res = await axios.get("https://www.omdbapi.com/", {
            params: {
              apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
              t: title,
            },
          });
          if (res.data.Response === "True") {
            return {
              Title: res.data.Title,
              Year: res.data.Year,
              imdbID: res.data.imdbID,
              Type: res.data.Type,
              Poster: res.data.Poster,
              Rated: res.data.Rated,
            };
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    // Filter out nulls and unsafe ratings (double check)
    const filteredResults = results.filter(
      (m) => m !== null && ["G", "PG", "PG-13"].includes(m.Rated)
    );

    return Response.json({ results: filteredResults });
  } catch (error) {
    console.error("Smart Search API error:", error);
    return Response.json({ error: "Failed to perform smart search" }, { status: 500 });
  }
}
