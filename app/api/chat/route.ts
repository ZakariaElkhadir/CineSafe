import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: [
      {
        role: "system",
        content: `You are the CineSafe Assistant, a friendly and expert family movie advisor. 
        Your goal is to help parents find safe movies for their children.
        
        Rules:
        - Only recommend movies that are generally family-friendly (rated G, PG, or PG-13).
        - If a movie is rated R or NC-17, warn the user clearly and do not recommend it for children.
        - Be concise but helpful.
        - Mention specific age suitability when possible.
        - Mention specific potential triggers (spiders, darkness, loud noises) if you know them.
        - Keep your tone warm, encouraging, and trustworthy.
        - Use simple markdown for emphasis (bold, lists).`
      },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1024,
    stream: true,
  });

  // Convert the OpenAI stream into a response stream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
