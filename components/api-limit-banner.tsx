"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, ShieldAlert } from "lucide-react";
import { useMovieCache } from "@/contexts/MovieCacheContext";

export const ApiLimitBanner = () => {
  const { apiLimitReached } = useMovieCache();

  return (
    <AnimatePresence>
      {apiLimitReached && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-[100] w-full overflow-hidden"
        >
          <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 p-1">
            <div className="flex items-center justify-between bg-zinc-950/90 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white md:text-base">
                    Movie API Limit Reached
                  </h3>
                  <p className="text-xs text-zinc-400 md:text-sm">
                    Our movie data provider has reached its daily request limit.
                    Some movie information may be unavailable until tomorrow.
                  </p>
                </div>
              </div>
              
              <div className="hidden items-center gap-4 md:flex">
                <div className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-white ring-1 ring-white/10">
                  Status: Restricted
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-rose-500 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
          
          {/* Subtle bottom glow */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
