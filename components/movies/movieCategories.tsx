"use client";

import React, { useEffect, useState } from "react";
import { useMovieCache } from "@/contexts/MovieCacheContext";
import Image from "next/image";
import Link from "next/link";
import { improvePosterQuality } from "../../app/api/MoviesData";
import { Star, Calendar, Award, Shield, ChevronRight, Film } from "lucide-react";
import LoadingCategorySection from "./LoadingCategorySection";
import { FavoritesButton } from "./favorites-button";

interface MovieCardProps {
  title: string;
  year: string;
  rating: string;
  safetyScore: string;
  description: string;
  image: string;
  imdbID: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  year,
  rating,
  description,
  image,
  imdbID,
}) => {
  return (
    <div className="group bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 h-full flex flex-col">
      {/* Poster */}
      <div className="relative w-full h-52 overflow-hidden flex-shrink-0">
        {image && image !== "N/A" && image !== "/default-poster.jpg" ? (
          <Image
            src={improvePosterQuality(image)}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-700">
            <Film className="h-12 w-12 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        {/* Favorites button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavoritesButton
            movie={{ imdbID, Title: title, Poster: image, Year: year }}
            size="sm"
          />
        </div>
        {/* Safe badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
          <Shield className="h-3 w-3 text-cyan-400" />
          <span className="text-xs text-cyan-400 font-medium">Safe</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base mb-1.5 text-white truncate">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {year}
          </div>
          {rating && rating !== "N/A" && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-amber-400">{rating}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{description}</p>
        <div className="mt-auto">
          <Link href={`/movies/${imdbID}`}>
            <button className="w-full flex items-center justify-center gap-1.5 text-sm text-white bg-gray-700/60 hover:bg-cyan-500/20 hover:text-cyan-400 border border-gray-600/50 hover:border-cyan-500/30 px-3 py-2 rounded-xl transition-all duration-200">
              View Details
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  movies: MovieCardProps[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, icon, movies }) => {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <Link href="/explore" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
          See all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {movies.map((movie, index) => (
          <MovieCard key={index} {...movie} />
        ))}
      </div>
    </div>
  );
};

function getRandomTitles(source: string[], count: number) {
  return [...source].sort(() => 0.5 - Math.random()).slice(0, count);
}

const MovieCategories = () => {
  const allFamilyFavorites = [
    "flow", "Home Alone", "Zathura", "Matilda", "Paddington",
    "Akeelah and the Bee", "The Mitchells vs. the Machines",
    "Shrek", "Despicable Me", "Night at the Museum", "Minions",
  ];
  const allNewReleases = [
    "The Tiger's Apprentice", "Wallace & Gromit: Vengeance Most Fowl",
    "Kung Fu Panda 4", "Soul", "Encanto", "Moana 2",
    "Mufasa: The Lion King", "Paddington in Peru", "How to Train Your Dragon",
  ];
  const allAwardWinners = [
    "The Lion King", "Finding Nemo", "Up", "Spirited Away",
    "Coco", "The Incredibles", "Toy Story 3", "Frozen", "Ratatouille",
  ];

  const { getMovie, getComponentData, setComponentData } = useMovieCache();
  const [awardWinners, setAwardWinners] = useState<MovieCardProps[]>([]);
  const [newReleases, setNewReleases] = useState<MovieCardProps[]>([]);
  const [familyFavorites, setFamilyFavorites] = useState<MovieCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const CACHE_KEYS = {
    familyFavorites: "movie-categories-family",
    newReleases: "movie-categories-releases",
    awardWinners: "movie-categories-awards",
    familySelection: "movie-categories-family-selection",
    releasesSelection: "movie-categories-releases-selection",
    awardsSelection: "movie-categories-awards-selection",
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const cachedFamily = getComponentData<MovieCardProps[]>(CACHE_KEYS.familyFavorites);
      const cachedReleases = getComponentData<MovieCardProps[]>(CACHE_KEYS.newReleases);
      const cachedAwards = getComponentData<MovieCardProps[]>(CACHE_KEYS.awardWinners);

      if (cachedFamily && cachedReleases && cachedAwards) {
        setFamilyFavorites(cachedFamily);
        setNewReleases(cachedReleases);
        setAwardWinners(cachedAwards);
        setIsLoading(false);
        return;
      }

      try {
        const toCard = async (name: string): Promise<MovieCardProps> => {
          const d = await getMovie(name);
          return {
            title: d?.Title || name,
            year: d?.Year || "",
            rating: d?.imdbRating || "",
            safetyScore: d?.Metascore || "",
            description: d?.Plot || "",
            image: d?.Poster || "",
            imdbID: d?.imdbID || "",
          };
        };

        const randomFamily = getComponentData<string[]>(CACHE_KEYS.familySelection) ||
          (() => { const r = getRandomTitles(allFamilyFavorites, 3); setComponentData(CACHE_KEYS.familySelection, r); return r; })();
        const randomReleases = getComponentData<string[]>(CACHE_KEYS.releasesSelection) ||
          (() => { const r = getRandomTitles(allNewReleases, 3); setComponentData(CACHE_KEYS.releasesSelection, r); return r; })();
        const randomAwards = getComponentData<string[]>(CACHE_KEYS.awardsSelection) ||
          (() => { const r = getRandomTitles(allAwardWinners, 3); setComponentData(CACHE_KEYS.awardsSelection, r); return r; })();

        const [familyData, releasesData, awardsData] = await Promise.all([
          Promise.all(randomFamily.map(toCard)),
          Promise.all(randomReleases.map(toCard)),
          Promise.all(randomAwards.map(toCard)),
        ]);

        setFamilyFavorites(familyData);
        setNewReleases(releasesData);
        setAwardWinners(awardsData);
        setComponentData(CACHE_KEYS.familyFavorites, familyData);
        setComponentData(CACHE_KEYS.newReleases, releasesData);
        setComponentData(CACHE_KEYS.awardWinners, awardsData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMovie, getComponentData, setComponentData]);

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-8">
        <LoadingCategorySection />
        <LoadingCategorySection />
        <LoadingCategorySection />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-8">
      <CategorySection
        title="Family Favorites"
        icon={<Star className="h-4 w-4 text-cyan-400" />}
        movies={familyFavorites}
      />
      <CategorySection
        title="New Releases"
        icon={<Calendar className="h-4 w-4 text-cyan-400" />}
        movies={newReleases}
      />
      <CategorySection
        title="Award Winners"
        icon={<Award className="h-4 w-4 text-cyan-400" />}
        movies={awardWinners}
      />
    </div>
  );
};

export default MovieCategories;
