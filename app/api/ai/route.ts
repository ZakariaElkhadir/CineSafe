import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Analysis result type
interface AnalysisResult {
  violence: { score: number; explanation: string };
  language: { score: number; explanation: string };
  scariness: { score: number; explanation: string };
  mature_themes: { score: number; explanation: string };
  safe_age: number;
  parent_tip: string;
  overall_verdict: string;
  conversation_starters: string[];
  positive_messages: string[];
  role_models: string[];
}

// Simple in-memory cache
const analysisCache = new Map<string, AnalysisResult>();

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

// Ensure the parsed result matches the AnalysisResult schema
function sanitizeAnalysisResult(parsed: any): AnalysisResult {
  const defaultScore = { score: 0, explanation: "No details available." };
  
  const sanitizeScore = (obj: any) => {
    if (!obj || typeof obj !== "object") return defaultScore;
    
    let score = 0;
    if (typeof obj.score === "number") {
      score = obj.score;
    } else if (typeof obj.score === "string") {
      score = parseFloat(obj.score) || 0;
    }
    
    return {
      score: Math.min(10, Math.max(0, score)),
      explanation: typeof obj.explanation === "string" ? obj.explanation : "No specific details provided.",
    };
  };

  const sanitizeArray = (arr: any): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item): item is string => typeof item === "string");
  };

  const overall_verdict = (parsed && (parsed.overall_verdict === "Safe" || parsed.overall_verdict === "Caution" || parsed.overall_verdict === "Not Recommended"))
    ? parsed.overall_verdict
    : "Caution";

  return {
    violence: sanitizeScore(parsed?.violence),
    language: sanitizeScore(parsed?.language),
    scariness: sanitizeScore(parsed?.scariness),
    mature_themes: sanitizeScore(parsed?.mature_themes),
    safe_age: typeof parsed?.safe_age === "number" ? parsed.safe_age : (parseInt(parsed?.safe_age) || 0),
    parent_tip: typeof parsed?.parent_tip === "string" ? parsed.parent_tip : "Please review content guidelines before letting children watch.",
    overall_verdict,
    conversation_starters: sanitizeArray(parsed?.conversation_starters),
    positive_messages: sanitizeArray(parsed?.positive_messages),
    role_models: sanitizeArray(parsed?.role_models),
  };
}

export async function POST(req: NextRequest) {
  const { title, plot, rating, year, genre, imdbID } = await req.json();

  if (!title) {
    return Response.json({ error: "Movie title is required" }, { status: 400 });
  }

  // Check cache if imdbID is provided
  if (imdbID && analysisCache.has(imdbID)) {
    return Response.json({ result: analysisCache.get(imdbID), cached: true });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        {
          role: "user",
          content: `Analyze the movie "${title}" (${year ?? "Unknown"}, rated ${rating ?? "NR"}, genre: ${genre ?? "Unknown"}) for child safety and family enrichment.

Plot: ${plot ?? "No plot available"}

Respond ONLY with this JSON object, no other text, no markdown:
{
  "violence": { "score": 0, "explanation": "" },
  "language": { "score": 0, "explanation": "" },
  "scariness": { "score": 0, "explanation": "" },
  "mature_themes": { "score": 0, "explanation": "" },
  "safe_age": 0,
  "parent_tip": "",
  "overall_verdict": "Safe",
  "conversation_starters": ["Specific Question 1?", "Specific Question 2?", "Specific Question 3?"],
  "positive_messages": ["Lesson/Theme 1", "Lesson/Theme 2"],
  "role_models": ["Character Name: why they are a good role model"]
}

Rules:
- Scores are 0-10 (0 = none, 10 = extreme)
- safe_age is a number (minimum recommended age)
- overall_verdict must be exactly one of: "Safe", "Caution", or "Not Recommended"
- conversation_starters should be 3-5 thought-provoking, age-appropriate questions for parents to ask children.
- positive_messages should focus on moral lessons and character growth.
- role_models should identify 1-2 characters and briefly explain their positive traits.
- Return ONLY the JSON object, nothing else`,
        },
      ],
      temperature: 0.1, // Lower temperature for more consistent JSON
      top_p: 0.7,
      max_tokens: 1024,
    });

    const raw = completion.choices[0].message.content ?? "";
    const parsed = extractAndParseJSON(raw);
    const result = sanitizeAnalysisResult(parsed);

    // Cache the result
    if (imdbID) {
      analysisCache.set(imdbID, result);
    }

    return Response.json({ result });
  } catch (error) {
    console.error("AI route error:", error);
    return Response.json(
      { error: "Failed to analyze movie safety" },
      { status: 500 },
    );
  }
}
