"use client";

import React from "react";
import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";

export function MovieDetailsHeader() {
  return (
    <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
      <button
        className="lg:hidden p-2 bg-gray-900/90 border border-gray-700 rounded-xl text-white backdrop-blur-sm transition-all hover:border-cyan-500/50"
        onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
        aria-label="Toggle Menu"
      >
        <Menu size={20} />
      </button>
      <Link href="/explore">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl text-white text-sm font-medium hover:bg-gray-800 transition-all">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </Link>
    </div>
  );
}
