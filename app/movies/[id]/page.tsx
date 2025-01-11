import Image from 'next/image';
import { fetchMovieById } from "@/app/api/MoviesData";
import { Suspense } from 'react';
import { Star, Clock, Calendar, Users, Award, Clapperboard } from 'lucide-react';
import { improvePosterQuality } from "@/app/api/MoviesData";

interface MovieDetailsProps {
  params: { id: string };
}

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const { id } = await params;

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:pl-72">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieContent id={id} />
      </Suspense>
    </div>
  );
}

async function MovieContent({ id }: { id: string }) {
  const movie = await fetchMovieById(id);

  if (!movie) {
    return <div className="text-center text-2xl text-gray-500">Movie not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative aspect-video sm:aspect-[21/9] lg:aspect-[21/8]">
        <Image
          src={movie.Poster ? improvePosterQuality(movie.Poster) : '/default-poster.jpg'}
          alt={`${movie.Title} Poster`}
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black to-transparent">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{movie.Title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-white">
            <CustomBadge>{movie.Year}</CustomBadge>
            <CustomBadge>{movie.Rated}</CustomBadge>
            <CustomBadge>{movie.Runtime}</CustomBadge>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {movie.Genre.split(', ').map((genre: string, index: number) => (
            <h3
              key={index}
              className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium hover:bg-white/30 transition-colors border border-cyan-600"
            >
              {genre}
            </h3>
          ))}
        </div>

        <p className="text-sm sm:text-base lg:text-lg text-gray-700">{movie.Plot}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem icon={<Star className="w-5 h-5 text-yellow-500" />} label="Rating" value={`${movie.imdbRating}/10`} />
          <InfoItem icon={<Clock className="w-5 h-5 text-blue-500" />} label="Runtime" value={movie.Runtime} />
          <InfoItem icon={<Calendar className="w-5 h-5 text-green-500" />} label="Released" value={movie.Released} />
          <InfoItem icon={<Users className="w-5 h-5 text-purple-500" />} label="Director" value={movie.Director} />
          <InfoItem icon={<Clapperboard className="w-5 h-5 text-red-500" />} label="Box Office" value={movie.BoxOffice || 'N/A'} />
          <InfoItem icon={<Award className="w-5 h-5 text-amber-500" />} label="Awards" value={movie.Awards} />
        </div>

        <div className="space-y-4">
          <InfoSection title="Cast" content={movie.Actors} />
          <InfoSection title="Writers" content={movie.Writer} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-2 text-gray-700 text-sm sm:text-base">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function InfoSection({ title, content }: { title: string, content: string }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-sm sm:text-base text-gray-700">{content}</p>
    </div>
  );
}

function CustomBadge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'outline' }) {
  const baseClasses = "inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-semibold";
  const variantClasses = variant === 'outline'
    ? "bg-white border border-gray-300 text-gray-700"
    : "bg-gray-100 text-gray-800";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {children}
    </span>
  );
}

function MovieDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-video sm:aspect-[21/9] lg:aspect-[21/8] bg-gray-200 animate-pulse" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-full animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-24 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}