import React from "react";

const LoadingCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Image skeleton */}
      <div className="relative w-full h-48 bg-gray-700 animate-pulse">
        <div className="absolute top-2 right-2 w-12 h-6 bg-gray-600 rounded-full animate-pulse" />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />

        {/* Info row skeleton */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-700 rounded mr-1 animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-700 rounded mr-1 animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-700 rounded mr-1 animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const LoadingCategorySection = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <div className="h-6 w-6 bg-gray-700 rounded mr-2 animate-pulse" />
        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default LoadingCategorySection;
