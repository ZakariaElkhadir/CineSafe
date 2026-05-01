"use client";

import { Sparkles } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { motion } from "framer-motion";

interface AskAIButtonProps {
  movieTitle: string;
}

export function AskAIButton({ movieTitle }: AskAIButtonProps) {
  const { openWithPrompt } = useChat();

  const handleAsk = () => {
    openWithPrompt(`Is the movie "${movieTitle}" too scary for a 4-year-old? What are the main moral lessons?`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAsk}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-purple-500/20 group"
    >
      <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
      Ask AI about this movie
    </motion.button>
  );
}
