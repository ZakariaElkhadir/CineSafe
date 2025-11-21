"use client";
import React, { useEffect, useState } from "react";
import { useMovieCache } from "@/contexts/MovieCacheContext";
import Image from "next/image";
import Link from "next/link";
import { improvePosterQuality } from "../../app/api/MoviesData";
import { Star, Calendar, Award, Shield, Info } from "lucide-react";
import LoadingCategorySection from "./LoadingCategorySection";

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
  safetyScore,
  description,
  image,
  imdbID,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-cyan-400 transition-all h-full flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={improvePosterQuality(image)}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        <div className="absolute top-2 right-2 bg-cyan-500 text-white px-2 py-1 rounded-full text-sm">
          {safetyScore}/100
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 text-white truncate">{title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {year}
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            {rating}
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-cyan-400">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-sm">Family Safe</span>
          </div>
          <Link href={`/movies/${imdbID}`}>
            <button className="flex items-center text-sm text-white bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600">
              <Info className="h-4 w-4 mr-1" />
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  title: string;
  movies: MovieCardProps[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, movies }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        {title === "Family Favorites" && (
          <Star className="h-6 w-6 text-cyan-400 mr-2" />
        )}
        {title === "New Releases" && (
          <Calendar className="h-6 w-6 text-cyan-400 mr-2" />
        )}
        {title === "Award Winners" && (
          <Award className="h-6 w-6 text-cyan-400 mr-2" />
        )}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={index} {...movie} />
        ))}
      </div>
    </div>
  );
};

// Utility to shuffle and pick random items
function getRandomTitles(source: string[], count: number) {
  return [...source].sort(() => 0.5 - Math.random()).slice(0, count);
}

// Demo component with sample data
const MovieCategories = () => {
  // Larger lists for each category
  const allFamilyFavorites = [
    "flow",
    "Home Alone",
    "Zathura",
    "Matilda",
    "Paddington",
    "Akeelah and the Bee",
    "The Mitchells vs. the Machines",
    "Shrek",
    "Despicable Me",
    "Night at the Museum",
    "Minions",
  ];
  const allNewReleases = [
    "The Tiger's Apprentice",
    "Wallace & Gromit: Vengeance Most Fowl",
    "Kung Fu Panda 4",
    "Soul",
    "Encanto",
    "Moana 2",
    "Mufasa: The Lion King",
    "Paddington in Peru",
    "How to Train Your Dragon",
  ];
  const allAwardWinners = [
    "The Lion King",
    "Finding Nemo",
    "Up",
    "Spirited Away",
    "Coco",
    "The Incredibles",
    "Spirited Away",
    "Finding Nemo",
    "Toy Story 3",
    "Frozen",
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
      // Check if data is already cached
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
        // Get or generate random selections
        let randomFamily: string[];
        let randomReleases: string[];
        let randomAwards: string[];

        const cachedFamilySelection = getComponentData<string[]>(CACHE_KEYS.familySelection);
        const cachedReleasesSelection = getComponentData<string[]>(CACHE_KEYS.releasesSelection);
        const cachedAwardsSelection = getComponentData<string[]>(CACHE_KEYS.awardsSelection);

        if (cachedFamilySelection) {
          randomFamily = cachedFamilySelection;
        } else {
          randomFamily = getRandomTitles(allFamilyFavorites, 3);
          setComponentData(CACHE_KEYS.familySelection, randomFamily);
        }

        if (cachedReleasesSelection) {
          randomReleases = cachedReleasesSelection;
        } else {
          randomReleases = getRandomTitles(allNewReleases, 3);
          setComponentData(CACHE_KEYS.releasesSelection, randomReleases);
        }

        if (cachedAwardsSelection) {
          randomAwards = cachedAwardsSelection;
        } else {
          randomAwards = getRandomTitles(allAwardWinners, 3);
          setComponentData(CACHE_KEYS.awardsSelection, randomAwards);
        }

        const familyFavoritesData = await Promise.all(
          randomFamily.map(async (name) => {
            const movieDetails = await getMovie(name);
            return {
              title: name,
              year: movieDetails?.Year || "",
              rating: movieDetails?.imdbRating || "",
              safetyScore: movieDetails?.Metascore || "",
              description: movieDetails?.Plot || "",
              image: movieDetails?.Poster || "",
              imdbID: movieDetails?.imdbID || "",
            };
          })
        );
        const newReleasesData = await Promise.all(
          randomReleases.map(async (name) => {
            const movieDetails = await getMovie(name);
            return {
              title: name,
              year: movieDetails?.Year || "",
              rating: movieDetails?.imdbRating || "",
              safetyScore: movieDetails?.Metascore || "",
              description: movieDetails?.Plot || "",
              image: movieDetails?.Poster || "",
              imdbID: movieDetails?.imdbID || "",
            };
          })
        );
        const awardWinnersData = await Promise.all(
          randomAwards.map(async (name) => {
            const movieDetails = await getMovie(name);
            return {
              title: name,
              year: movieDetails?.Year || "",
              rating: movieDetails?.imdbRating || "",
              safetyScore: movieDetails?.Metascore || "",
              description: movieDetails?.Plot || "",
              image: movieDetails?.Poster || "",
              imdbID: movieDetails?.imdbID || "",
            };
          })
        );
        setFamilyFavorites(familyFavoritesData);
        setNewReleases(newReleasesData);
        setAwardWinners(awardWinnersData);
        setComponentData(CACHE_KEYS.familyFavorites, familyFavoritesData);
        setComponentData(CACHE_KEYS.newReleases, newReleasesData);
        setComponentData(CACHE_KEYS.awardWinners, awardWinnersData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [getMovie, getComponentData, setComponentData]);

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-900">
        <LoadingCategorySection />
        <LoadingCategorySection />
        <LoadingCategorySection />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900">
      <CategorySection title="Family Favorites" movies={familyFavorites} />
      <CategorySection title="New Releases" movies={newReleases} />
      <CategorySection title="Award Winners" movies={awardWinners} />
    </div>
  );
};

export default MovieCategories;
