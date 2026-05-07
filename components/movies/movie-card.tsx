import Image from "next/image";
import Link from "next/link";
import { Film, Shield } from "lucide-react";

interface MovieCardProps {
  title: string;
  image: string;
  href: string;
  year?: string;
}

export function MovieCard({ title, image, href, year }: MovieCardProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1.5 cursor-pointer flex flex-col h-full shadow-lg">
        {/* Poster Wrapper */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-950 flex-shrink-0">
          {image && image !== "/default-poster.jpg" && image !== "N/A" ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-900">
              <Film className="h-10 w-10 text-gray-700" />
            </div>
          )}

          {/* Constant Safe Badge Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded-full backdrop-blur-md shadow-sm z-10">
            <Shield className="h-3 w-3 text-cyan-400 fill-cyan-400/20" />
            <span className="text-[10px] text-cyan-400 font-extrabold tracking-wider uppercase">Safe</span>
          </div>

          {/* Hover Glassmorphic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-10">
            <p className="text-white text-base font-bold leading-snug line-clamp-2 drop-shadow-md">
              {title}
            </p>
            {year && (
              <p className="text-cyan-400 text-xs font-semibold mt-1 flex items-center gap-1">
                <span>{year}</span>
                <span>•</span>
                <span>Family Verified</span>
              </p>
            )}
          </div>
        </div>

        {/* Title & Info Below Poster (Visible always for clean fallback) */}
        <div className="p-3.5 bg-gray-900/40 flex-1 flex flex-col justify-between border-t border-gray-800/40">
          <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-cyan-400 transition-colors duration-300">
            {title}
          </h3>
          {year && (
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {year}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
