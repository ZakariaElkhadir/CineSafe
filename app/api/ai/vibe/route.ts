import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

interface VibeSuggestion {
  title: string;
  vibe: string;
}

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

function sanitizeVibeSuggestions(parsed: any): VibeSuggestion[] {
  let rawArray: any[] = [];
  if (Array.isArray(parsed)) {
    rawArray = parsed;
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.suggestions)) {
      rawArray = parsed.suggestions;
    } else if (Array.isArray(parsed.movies)) {
      rawArray = parsed.movies;
    } else {
      // Find any array key
      const arrayKey = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
      if (arrayKey) {
        rawArray = parsed[arrayKey];
      }
    }
  }

  return rawArray
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      return {
        title: typeof item.title === "string" ? item.title : (item.name || "Unknown Movie"),
        vibe: typeof item.vibe === "string" ? item.vibe : "Similar emotional vibe and family-friendly atmosphere.",
      };
    })
    .filter((item): item is VibeSuggestion => item !== null);
}

export async function POST(req: NextRequest) {
  const { title, plot, genre } = await req.json();

  if (!title) {
    return Response.json({ error: "Movie title is required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "user",
          content: `Given the movie "${title}" (Genre: ${genre}), suggest 5 other family-friendly movies that have a similar emotional vibe, moral lessons, or atmosphere. 

Plot of ${title}: ${plot}

Respond ONLY with this JSON array of objects, no other text:
[
  { "title": "Movie Title", "vibe": "Brief explanation of why it has a similar vibe" }
]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const raw = completion.choices[0].message.content ?? "";
    const parsed = extractAndParseJSON(raw);
    const suggestions = sanitizeVibeSuggestions(parsed);

    return Response.json({ suggestions });
  } catch (error) {
    console.error("Vibe API error:", error);
    return Response.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
