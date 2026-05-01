import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Simple in-memory cache
const analysisCache = new Map<string, any>();

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
      model: "meta/llama-3.3-70b-instruct",
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
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

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
