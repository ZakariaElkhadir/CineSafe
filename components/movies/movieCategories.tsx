"use client";
import React, { useEffect, useState } from "react";
import { fetchMovieByName } from "../../app/api/MoviesData";
import Image from "next/image";

import { Star, Calendar, Award, Shield, Info } from "lucide-react";

interface MovieCardProps {
  title: string;
  year: string;
  rating: string;
  safetyScore: string;
  description: string;
  image: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  year,
  rating,
  safetyScore,
  description,
  image,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-cyan-400 transition-all">
      <div className="aspect-video relative">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute top-2 right-2 bg-cyan-500 text-white px-2 py-1 rounded-full text-sm">
          {safetyScore}/10
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
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
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-cyan-400">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-sm">Family Safe</span>
          </div>
          <button className="flex items-center text-sm text-white bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600">
            <Info className="h-4 w-4 mr-1" />
            Details
          </button>
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

// Demo component with sample data
const MovieCategories = () => {
  const movieNames = ["flow", "Home Alone", "Zathura"];
  const newReleasesMovies = [
    "The Tiger's Apprentice",
    "Wallace & Gromit: Vengeance Most Fowl",
    "Kung Fu Panda 4",
  ];
  const [newReleases, setNewReleases] = useState<MovieCardProps[]>([]);
  const [familyFavorites, setFamilyFavorites] = useState<MovieCardProps[]>([]);

  const awardWinners = [
    {
      title: "Dragon School",
      year: "2023",
      rating: "4.9",
      safetyScore: "9.8",
      description:
        "Award-winning tale about young dragons learning to fly and make friends.",
      image: "/api/placeholder/300/169",
    },
    {
      title: "Rainbow City",
      year: "2023",
      rating: "4.8",
      safetyScore: "9.7",
      description:
        "Critically acclaimed story about celebrating differences and unity.",
      image: "/api/placeholder/300/169",
    },
    {
      title: "Time Travelers",
      year: "2023",
      rating: "4.9",
      safetyScore: "9.6",
      description:
        "Multiple award-winning adventure through historical events for young minds.",
      image: "/api/placeholder/300/169",
    },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      const familyFavoritesData = await Promise.all(
        movieNames.map(async (name) => {
          const movieDetails = await fetchMovieByName(name);
          return {
            title: name,
            year: movieDetails?.Year || "",
            rating: movieDetails?.imdbRating || "",
            safetyScore: movieDetails?.Metascore || "",
            description: movieDetails?.Plot || "",
            image: movieDetails?.Poster || "", 
          };
        })
      );
      const newReleasesData = await Promise.all(
        newReleasesMovies.map(async (name) => {
          const movieDetails = await fetchMovieByName(name);
          return {
            title: name,
            year: movieDetails?.Year || "",
            rating: movieDetails?.imdbRating || "",
            safetyScore: movieDetails?.Metascore || "",
            description: movieDetails?.Plot || "",
            image: movieDetails?.Poster || "", // Include image URL
          };
        })
      );
      setFamilyFavorites(familyFavoritesData);
      setNewReleases(newReleasesData);
    };

    fetchImages();
  }, []); // Empty dependency arr

  return (
    <div className="p-8 bg-gray-900">
      <CategorySection title="Family Favorites" movies={familyFavorites} />
      <CategorySection title="New Releases" movies={newReleases} />
      <CategorySection title="Award Winners" movies={awardWinners} />
    </div>
  );
};

export default MovieCategories;
