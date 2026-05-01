"use client";

import { useState, useEffect } from "react";
import { Shield, Info, AlertTriangle, CheckCircle2, XCircle, Sparkles, Heart, MessageSquare, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface SafetyScore {
  score: number;
  explanation: string;
}

interface AnalysisResult {
  violence: SafetyScore;
  language: SafetyScore;
  scariness: SafetyScore;
  mature_themes: SafetyScore;
  safe_age: number;
  parent_tip: string;
  overall_verdict: "Safe" | "Caution" | "Not Recommended";
  conversation_starters?: string[];
  positive_messages?: string[];
  role_models?: string[];
}

interface AISafetyCardProps {
  movie: {
    imdbID: string;
    Title: string;
    Plot: string;
    Rated: string;
    Year: string;
    Genre: string;
  };
}

import { AILoading } from "@/components/ai-loading";

export function AISafetyCard({ movie }: AISafetyCardProps) {
  // ... (previous state and effect code remains the same)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: movie.Title,
            plot: movie.Plot,
            rating: movie.Rated,
            year: movie.Year,
            genre: movie.Genre,
            imdbID: movie.imdbID,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAnalysis(data.result);
      } catch (err) {
        console.error("AI Analysis error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [movie]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) return <AILoading label="Analyzing Safety & Themes..." />;
  if (error || !analysis) return null;

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "Safe":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-400",
          icon: <CheckCircle2 className="w-5 h-5" />,
        };
      case "Caution":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          icon: <AlertTriangle className="w-5 h-5" />,
        };
      default:
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-400",
          icon: <XCircle className="w-5 h-5" />,
        };
    }
  };

  const verdict = getVerdictStyles(analysis.overall_verdict);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/40 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Safety Insight</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Llama 3.3 Analysis</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${verdict.bg} ${verdict.border} ${verdict.text}`}>
          {verdict.icon}
          <span className="text-xs font-bold">{analysis.overall_verdict}</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Top Age Badge & Tip */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-shrink-0 px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center min-w-[100px]">
            <p className="text-[10px] text-cyan-500 uppercase font-bold mb-1">Recommended</p>
            <p className="text-2xl font-black text-white">Ages {analysis.safe_age}+</p>
          </div>
          <div className="flex-1 p-3 bg-gray-900/40 rounded-xl border border-gray-700/30 flex gap-3 italic text-sm text-gray-300">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>&quot;{analysis.parent_tip}&quot;</p>
          </div>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <ScoreBar label="Violence" score={analysis.violence.score} explanation={analysis.violence.explanation} />
          <ScoreBar label="Language" score={analysis.language.score} explanation={analysis.language.explanation} />
          <ScoreBar label="Scariness" score={analysis.scariness.score} explanation={analysis.scariness.explanation} />
          <ScoreBar label="Mature Themes" score={analysis.mature_themes.score} explanation={analysis.mature_themes.explanation} />
        </div>

        {/* Positive Messages & Role Models */}
        {(analysis.positive_messages || analysis.role_models) && (
          <div className="pt-6 border-t border-gray-700/50 space-y-6">
            {analysis.positive_messages && analysis.positive_messages.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Heart size={14} className="fill-cyan-400/20" />
                  Positive Messages & Lessons
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.positive_messages.map((msg, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-xl text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.role_models && analysis.role_models.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={14} className="fill-amber-400/20" />
                  Positive Role Models
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.role_models.map((model, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conversation Starters */}
        {analysis.conversation_starters && analysis.conversation_starters.length > 0 && (
          <div className="pt-6 border-t border-gray-700/50">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={14} className="fill-purple-400/20" />
              Family Discussion Guide
            </h4>
            <div className="space-y-3">
              {analysis.conversation_starters.map((q, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between gap-4 p-3 bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 rounded-xl transition-all"
                >
                  <p className="text-sm text-gray-200">{q}</p>
                  <button
                    onClick={() => copyToClipboard(q, i)}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ScoreBar({ label, score, explanation }: { label: string; score: number; explanation: string }) {
  // Score color based on value (inverted logic: high score = more content = more "caution")
  const getColor = (s: number) => {
    if (s <= 2) return "bg-green-500";
    if (s <= 5) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between group">
        <span className="text-xs font-semibold text-gray-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 bg-gray-700 rounded">{score}/10</span>
        </div>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${getColor(score)}`}
        />
      </div>
      <p className="text-[10px] text-gray-500 line-clamp-1 group-hover:line-clamp-none transition-all duration-200">
        {explanation}
      </p>
    </div>
  );
}

