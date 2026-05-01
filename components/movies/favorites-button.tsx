"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";

interface FavoritesButtonProps {
  movie: {
    imdbID: string;
    Title: string;
    Poster?: string;
    Year: string;
    imdbRating?: string;
  };
  size?: "sm" | "md";
  className?: string;
}

export function FavoritesButton({ movie, size = "md", className = "" }: FavoritesButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const liked = isFavorite(movie.imdbID);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  const iconSize = size === "sm" ? 14 : 18;
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      onClick={toggle}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      className={`
        ${btnSize} flex items-center justify-center rounded-full transition-all duration-200
        ${liked
          ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
          : "bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-rose-400"
        }
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={liked ? "filled" : "empty"}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.7 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            size={iconSize}
            className={liked ? "fill-rose-400" : ""}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
