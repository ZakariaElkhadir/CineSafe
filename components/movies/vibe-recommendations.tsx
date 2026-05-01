"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Film } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { fetchMovieByName, Movie, improvePosterQuality } from "@/app/api/MoviesData";

interface VibeSuggestion {
  title: string;
  vibe: string;
}

interface VibeRecommendationsProps {
  movie: {
    Title: string;
    Plot: string;
    Genre: string;
  };
}

import { AILoading } from "@/components/ai-loading";

export function VibeRecommendations({ movie }: VibeRecommendationsProps) {
  // ... (previous state and effect code remains the same)
  const [suggestions, setSuggestions] = useState<(VibeSuggestion & { details?: Movie | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecommendations() {
      try {
        setLoading(true);
        const res = await fetch("/api/ai/vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.Title,
            plot: movie.Plot,
            genre: movie.Genre,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const rawSuggestions: VibeSuggestion[] = data.suggestions;

        // Fetch details for each suggested movie to get posters
        const enriched = await Promise.all(
          rawSuggestions.map(async (s) => {
            const details = await fetchMovieByName(s.title);
            return { ...s, details };
          })
        );

        setSuggestions(enriched.filter(s => s.details !== null));
      } catch (err) {
        console.error("Vibe recs error:", err);
      } finally {
        setLoading(false);
      }
    }

    getRecommendations();
  }, [movie]);

  if (loading) return <AILoading label="Curating Thematic Recommendations..." className="mt-12" />;
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Similar Vibe & Moral Lessons
          </h3>
          <p className="text-sm text-gray-500 mt-1">AI-powered recommendations based on themes, not just genre.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <Link href={`/movies/${s.details?.imdbID}`} className="block space-y-3">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 group-hover:border-purple-500/50 transition-all shadow-lg">
                {s.details?.Poster && s.details.Poster !== "N/A" ? (
                  <Image
                    src={improvePosterQuality(s.details.Poster)}
                    alt={s.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Film className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                   <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-1">The Vibe</p>
                   <p className="text-[11px] text-gray-200 line-clamp-3 italic">"{s.vibe}"</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{s.details?.Year} • {s.details?.Rated}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

