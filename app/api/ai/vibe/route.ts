import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

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
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(cleaned);

    return Response.json({ suggestions });
  } catch (error) {
    console.error("Vibe API error:", error);
    return Response.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
