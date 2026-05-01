"use client";

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { Movie } from "@/app/api/MoviesData";
import { fetchMovieByName } from "@/app/api/MoviesData";

interface MovieCacheContextType {
  getMovie: (name: string) => Promise<Movie | null>;
  getComponentData: <T>(key: string) => T | null;
  setComponentData: <T>(key: string, data: T) => void;
  clearCache: () => void;
  cache: Map<string, Movie | null>;
  apiLimitReached: boolean;
  setApiLimitReached: (reached: boolean) => void;
}

const MovieCacheContext = createContext<MovieCacheContextType | undefined>(undefined);

export const MovieCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<Map<string, Movie | null>>(new Map());
  const [componentDataCache, setComponentDataCache] = useState<Map<string, any>>(new Map());
  const [apiLimitReached, setApiLimitReached] = useState(false);
  const cacheRef = useRef<Map<string, Movie | null>>(new Map());
  const componentDataCacheRef = useRef<Map<string, any>>(new Map());

  React.useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  React.useEffect(() => {
    componentDataCacheRef.current = componentDataCache;
  }, [componentDataCache]);

  const getMovie = useCallback(async (name: string): Promise<Movie | null> => {
    const cacheKey = name.toLowerCase().trim();
    
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey) || null;
    }

    try {
      const movie = await fetchMovieByName(name);
      
      setCache((prevCache) => {
        const newCache = new Map(prevCache);
        newCache.set(cacheKey, movie);
        return newCache;
      });

      return movie;
    } catch (error: any) {
      if (error.response?.status === 401) {
        setApiLimitReached(true);
      }
      return null;
    }
  }, []);

  const getComponentData = useCallback(<T,>(key: string): T | null => {
    return (componentDataCacheRef.current.get(key) as T) || null;
  }, []);

  const setComponentData = useCallback(<T,>(key: string, data: T) => {
    setComponentDataCache((prevCache) => {
      const newCache = new Map(prevCache);
      newCache.set(key, data);
      return newCache;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache(new Map());
    setComponentDataCache(new Map());
  }, []);

  return (
    <MovieCacheContext.Provider value={{ getMovie, getComponentData, setComponentData, clearCache, cache, apiLimitReached, setApiLimitReached }}>
      {children}
    </MovieCacheContext.Provider>
  );
};

export const useMovieCache = () => {
  const context = useContext(MovieCacheContext);
  if (context === undefined) {
    throw new Error("useMovieCache must be used within a MovieCacheProvider");
  }
  return context;
};

