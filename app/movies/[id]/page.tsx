import Image from "next/image";
import { fetchMovieById } from "@/app/api/MoviesData";
import { Suspense } from "react";
import {
  Star,
  Clock,
  Calendar,
  Users,
  Award,
  Clapperboard,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { improvePosterQuality } from "@/app/api/MoviesData";
import Link from "next/link";
import { AISafetyCard } from "@/components/movies/ai-safety-card";
import { VibeRecommendations } from "@/components/movies/vibe-recommendations";
import { AskAIButton } from "@/components/movies/ask-ai-button";

export default async function MovieDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen lg:pl-72">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieContent id={id} />
      </Suspense>
    </div>
  );
}

async function MovieContent({ id }: { id: string }) {
  const movie = await fetchMovieById(id);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-2xl text-gray-400">Movie not found</p>
        <p className="text-gray-600 text-sm">This movie may not meet our family-safe criteria.</p>
        <Link href="/explore" className="mt-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold rounded-full transition-all text-sm">
          Back to Explore
        </Link>
      </div>
    );
  }

  const ratingNum = parseFloat(movie.imdbRating);
  const ratingPercent = isNaN(ratingNum) ? 0 : (ratingNum / 10) * 100;

  return (
    <div className="pb-12">
      {/* ─── Hero Banner ─── */}
      <div className="relative h-[380px] md:h-[460px] overflow-hidden">
        <Image
          src={movie.Poster ? improvePosterQuality(movie.Poster) : "/default-poster.jpg"}
          alt={`${movie.Title} Poster`}
          fill
          className="object-cover object-top brightness-40"
          priority
          unoptimized
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,8%)] via-[hsl(220,20%,8%)]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,20%,8%)]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link href="/explore">
            <button className="flex items-center gap-2 px-4 py-2 glass-dark rounded-full text-white text-sm font-medium hover:bg-white/10 transition-all">
              <ArrowLeft size={16} />
              Back
            </button>
          </Link>
        </div>

        {/* Title & badges */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.Genre.split(", ").map((g) => (
              <span key={g} className="px-3 py-1 text-xs font-medium bg-white/10 border border-white/15 rounded-full text-gray-300 backdrop-blur-sm">
                {g}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {movie.Title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs bg-gray-800 text-gray-300 rounded-full border border-gray-700">
              {movie.Year}
            </span>
            <span className="px-2.5 py-1 text-xs bg-cyan-500/15 text-cyan-400 rounded-full border border-cyan-500/30 font-medium">
              {movie.Rated} ✓ Safe
            </span>
            <span className="px-2.5 py-1 text-xs bg-gray-800 text-gray-300 rounded-full border border-gray-700">
              {movie.Runtime}
            </span>
          </div>
          <div className="mt-6">
            <AskAIButton movieTitle={movie.Title} />
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="px-4 md:px-10 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating bar */}
            <div className="p-5 bg-gray-800/40 rounded-2xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-2xl font-bold text-white">{movie.imdbRating}</span>
                  <span className="text-gray-500 text-sm">/10</span>
                </div>
                {movie.Metascore && movie.Metascore !== "N/A" && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Metascore:</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-sm ${
                      parseInt(movie.Metascore) >= 70 ? "bg-green-500/20 text-green-400" :
                      parseInt(movie.Metascore) >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>{movie.Metascore}</span>
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${ratingPercent}%` }}
                />
              </div>
            </div>

            {/* Plot */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Synopsis</h2>
              <p className="text-gray-400 leading-relaxed">{movie.Plot}</p>
            </div>

            {/* AI Safety Analysis */}
            <AISafetyCard movie={movie} />

            {/* Cast & Crew */}
            <div className="space-y-4">
              <InfoSection
                icon={<Users className="w-4 h-4 text-cyan-400" />}
                title="Cast"
                content={movie.Actors}
              />
              <InfoSection
                icon={<Clapperboard className="w-4 h-4 text-cyan-400" />}
                title="Director"
                content={movie.Director}
              />
              <InfoSection
                icon={<Clapperboard className="w-4 h-4 text-cyan-400" />}
                title="Writers"
                content={movie.Writer}
              />
            </div>
          </div>

          {/* Right: quick stats */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Details</h2>
            <StatCard icon={<Clock className="w-4 h-4 text-blue-400" />} label="Runtime" value={movie.Runtime} />
            <StatCard icon={<Calendar className="w-4 h-4 text-green-400" />} label="Released" value={movie.Released} />
            <StatCard icon={<Clapperboard className="w-4 h-4 text-red-400" />} label="Box Office" value={movie.BoxOffice || "N/A"} />
            <StatCard icon={<Award className="w-4 h-4 text-amber-400" />} label="Awards" value={movie.Awards} />
            <StatCard icon={<Shield className="w-4 h-4 text-cyan-400" />} label="Rating" value={movie.Rated} />
          </div>
        </div>

        {/* AI Recommendations */}
        <VibeRecommendations movie={movie} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3.5 bg-gray-800/40 rounded-xl border border-gray-700/50">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function InfoSection({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) {
  return (
    <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{content}</p>
    </div>
  );
}

function MovieDetailsSkeleton() {
  return (
    <div className="pb-12 animate-pulse">
      <div className="h-[380px] md:h-[460px] bg-gray-800" />
      <div className="px-4 md:px-10 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-16 bg-gray-800 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-800 rounded w-5/6" />
              <div className="h-4 bg-gray-800 rounded w-4/6" />
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}