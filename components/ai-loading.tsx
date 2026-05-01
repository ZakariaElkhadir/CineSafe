"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AILoadingProps {
  label?: string;
  className?: string;
}

export function AILoading({ label = "AI is analyzing...", className = "" }: AILoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 space-y-6 bg-gray-800/20 border border-gray-700/30 rounded-3xl backdrop-blur-sm ${className}`}>
      <div className="relative">
        {/* Outer glowing rings */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-cyan-500 blur-2xl"
        />
        
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-16 h-16 rounded-full border-2 border-dashed border-cyan-500/30 flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            />
          </motion.div>
        ))}
      </div>

      <div className="text-center space-y-2">
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-sm font-bold text-white tracking-widest uppercase"
        >
          {label}
        </motion.p>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
          Powered by Llama 3.3 Intelligence
        </p>
      </div>
    </div>
  );
}

export function AILoadingHorizontal({ label = "Thinking..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-2xl">
      <div className="relative w-8 h-8 flex-shrink-0">
         <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-2 border-cyan-500/20 border-t-cyan-500"
        />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-cyan-400" />
      </div>
      <p className="text-xs font-bold text-cyan-400 animate-pulse uppercase tracking-wider">{label}</p>
    </div>
  );
}
