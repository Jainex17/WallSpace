import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";

export interface WallpaperTypes {
  imageuri: string;
  title: string;
  id: string;
  color?: string;
  blur_hash?: string;
}

interface GenerateWallpaperRequest {
  prompt: string;
}

interface GenerateWallpaperResponse {
  message: string;
  process_id: string;
  status_url: string;
  callback_url: string;
  webhook_url: string;
}

interface StatusCheckRequest {
  process_id: string;
}

interface StatusCheckResponse {
  status: "PENDING" | "COMPLETED" | "FAILED";
  imageUrl?: string;
  process_id: string;
  result?: {
    output?: string[];
    imageUrl?: string;
  };
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}/api/v1/wallpapers`;

export const STORAGE_KEY = {
  LIKED_WALLPAPERS: "likedWallpapersID",
};

// Cache object to store API responses
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCarouselWallPapers(): Promise<WallpaperTypes[]> {
  try {    
    const response = await fetch(`${API_BASE}/carousel`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return [];
  }
}

export function useWallpaperData(query?: string) {
  const [data, setData] = useState<WallpaperTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const cacheKey = query ? `wallpaper_${query}` : "mobile wallpapers";
    const cachedData = apiCache[cacheKey];

    // Check if we have valid cached data
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      setData(cachedData.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const wallpapers = await getExploreWallpapers(query);

      // Cache the response
      apiCache[cacheKey] = {
        data: wallpapers,
        timestamp: Date.now(),
      };

      setData(wallpapers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export async function getExploreWallpapers(
  query = "mobile wallpaper",
  count = 20
): Promise<WallpaperTypes[]> {
  try {
    const response = await fetch(
      `${API_BASE}/explore?query=${query}&count=${count}`
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching explore wallpapers:", error);
    return [];
  }
}

// Cached version of getExploreWallpapers
export async function getCachedExploreWallpapers(
  query = "mobile wallpaper",
  count = 10
): Promise<WallpaperTypes[]> {
  const cacheKey = `explore_${query}_${count}`;
  const cachedData = apiCache[cacheKey];

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const data = await getExploreWallpapers(query, count);
  apiCache[cacheKey] = {
    data,
    timestamp: Date.now(),
  };

  return data;
}

export async function getSuggestedWallPapers(
  query = "nature",
  count = 20
): Promise<WallpaperTypes[]> {
  try {
    const response = await fetch(
      `${API_BASE}/suggested?query=${query}&count=${count}`
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching suggested wallpapers:", error);
    return [];
  }
}

export async function getLikedWallpapersDetails(): Promise<WallpaperTypes[]> {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY.LIKED_WALLPAPERS);
    const likedWallpapers = storedData ? JSON.parse(storedData) : [];

    if (likedWallpapers.length === 0) return [];

    const response = await fetch(`${API_BASE}/getById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: likedWallpapers }),
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching liked wallpapers:", error);
    return [];
  }
}
export async function getAIGenratedWallpaper(
  query = "nature"
): Promise<WallpaperTypes> {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"prompt": query})
    });
    
    if (!response.ok) {
      throw new Error('Generation failed');
    }
    
    const data: GenerateWallpaperResponse = await response.json();
    
    // Wait for the final status
    const result = await waitForImageStatus(data.process_id);
    
    if (!result || result.status === "FAILED" || !result.imageUrl) {
      throw new Error('Generation failed');
    }

    return {
      id: data.process_id,
      imageuri: result.imageUrl,
      title: query,
    };
  } catch (error) {
    console.error("Error generating AI wallpaper:", error);
    return {
      id: "",
      imageuri: "",
      title: query,
    };
  }
}

async function waitForImageStatus(processId: string): Promise<StatusCheckResponse | null> {
  const maxAttempts = 30; // Maximum number of attempts (30 * 2 seconds = 60 seconds total)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await checkImageStatus(processId);
    
    if (!status) return null;
    
    if (status.status === "COMPLETED" || status.status === "FAILED") {
      return status;
    }
    
    // Wait for 2 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  return null;
}

async function checkImageStatus(processId: string): Promise<StatusCheckResponse | null> {
  try {
    const statusRequest: StatusCheckRequest = { process_id: processId };
    const response = await fetch(`${API_BASE}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusRequest)
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error checking status:", error);
    return null;
  }
}
