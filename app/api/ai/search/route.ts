import OpenAI from "openai";
import { NextRequest } from "next/server";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Helper to extract and parse JSON robustly
function extractAndParseJSON(raw: string): any {
  const trimmed = raw.trim();
  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch {}

  // Remove markdown block backticks
  let cleaned = trimmed.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {}

  // Find boundaries of the JSON payload
  const startCurly = cleaned.indexOf('{');
  const startBracket = cleaned.indexOf('[');
  
  let start = -1;
  let end = -1;
  
  if (startCurly !== -1 && (startBracket === -1 || startCurly < startBracket)) {
    start = startCurly;
    end = cleaned.lastIndexOf('}');
  } else if (startBracket !== -1) {
    start = startBracket;
    end = cleaned.lastIndexOf(']');
  }
  
  if (start !== -1 && end !== -1 && end > start) {
    const extracted = cleaned.substring(start, end + 1);
    try {
      return JSON.parse(extracted);
    } catch {
      // Try stripping standard single-line/multi-line comments
      const commentless = extracted.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
      try {
        return JSON.parse(commentless);
      } catch {}
    }
  }

  throw new Error("Unable to extract valid JSON from LLM response");
}

function sanitizeSearchTitles(parsed: any): string[] {
  let rawArray: any[] = [];
  if (Array.isArray(parsed)) {
    rawArray = parsed;
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.titles)) {
      rawArray = parsed.titles;
    } else if (Array.isArray(parsed.movies)) {
      rawArray = parsed.movies;
    } else if (Array.isArray(parsed.results)) {
      rawArray = parsed.results;
    } else {
      const arrayKey = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
      if (arrayKey) {
        rawArray = parsed[arrayKey];
      }
    }
  }

  return rawArray
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && typeof item.title === "string") return item.title;
      return null;
    })
    .filter((item): item is string => item !== null);
}

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
    const parsed = extractAndParseJSON(raw);
    const titles = sanitizeSearchTitles(parsed);

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
