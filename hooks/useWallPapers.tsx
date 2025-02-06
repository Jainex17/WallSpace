import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from 'react';

export interface WallpaperTypes {
  imageuri: string;
  title: string;
  id: string;
}

const ACCESS_KEY = process.env.EXPO_PUBLIC_ACCESS_KEY;
const ACCESS_KEY1 = process.env.EXPO_PUBLIC_ACCESS_KEY1;
const MONSTER_API_KEY = process.env.EXPO_PUBLIC_MONSTER_API_KEY;

export const STORAGE_KEY = {
  LIKED_WALLPAPERS: 'likedWallpapersID'
};

// Cache object to store API responses
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCarouselWallPapers(): WallpaperTypes[] {
  return [
    {
      id: "1",
      imageuri:
        "https://images.unsplash.com/photo-1684262483735-1101bcb10f0d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "",
    },
    {
      id: "2",
      imageuri:
        "https://images.unsplash.com/photo-1738417715244-338e5a70bdda?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "",
    },
    {
      id: "3",
      imageuri:
        "https://images.unsplash.com/photo-1738167039036-de7b00545f01?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "",
    },
    {
      id: "4",
      imageuri:
        "https://images.unsplash.com/photo-1738236013982-9449791344de?q=80&w=1873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "",
    },
  ];
}

export function useWallpaperData(query?: string) {
  const [data, setData] = useState<WallpaperTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const cacheKey = query ? `wallpaper_${query}` : 'wallpaper_default';
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
        timestamp: Date.now()
      };
      
      setData(wallpapers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export async function getExploreWallpapers(query = 'mobile wallpaper', count = 10): Promise<WallpaperTypes[]> {
  try {

      const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&count=${count}`,
          {
              headers: {
                  'Authorization': `Client-ID ${ACCESS_KEY}`
              }
          }
      );  
      if (!response.ok) {
        console.error('Error fetching wallpapers:', response);
        return [];
      }

      const data = await response.json();
      return data.map((photo: any) => ({
          id: photo.id,
          imageuri: photo.urls.regular,
          title: photo.alt_description || 'Wallpaper',
      }));
  } catch (error) {
      console.error('Catch Error fetching wallpapers:', error);
      return [];
  }
}

// Cached version of getExploreWallpapers
export async function getCachedExploreWallpapers(query = 'mobile wallpaper', count = 10): Promise<WallpaperTypes[]> {
  const cacheKey = `explore_${query}_${count}`;
  const cachedData = apiCache[cacheKey];

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  const data = await getExploreWallpapers(query, count);
  apiCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };

  return data;
}

export async function getSuggestedWallPapers(query = 'nature', count = 20): Promise<WallpaperTypes[]> {
  try {
      const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&count=${count}`,
          {
              headers: {
                  'Authorization': `Client-ID ${ACCESS_KEY1}`
              }
          }
      );
      
      if (!response.ok) {
          console.error('Error fetching wallpapers:', response);
          return [];    
      }

      const data = await response.json();
      return data.map((photo: any) => ({
          id: photo.id,
          imageuri: photo.urls.regular,
          title: photo.alt_description || 'Wallpaper',
      }));
  } catch (error) {
      console.error('Catch Error fetching suggested wallpapers:', error);
      return [];
  }
}

export async function getLikedWallpapersDetails(): Promise<WallpaperTypes[]> {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY.LIKED_WALLPAPERS);
    const likedWallpapers = storedData ? JSON.parse(storedData) : [];
    
    const wallpapers: WallpaperTypes[] = [];

    for(let i = 0; i < likedWallpapers.length; i++) {
      const response = await fetch(
        `https://api.unsplash.com/photos/${likedWallpapers[i]}`,
        {
            headers: {
                'Authorization': `Client-ID ${ACCESS_KEY}`
            }
        }
      );
      if(response.ok) {
        const photo = await response.json();
        wallpapers.push({
          id: photo.id,
          imageuri: photo.urls.regular,
          title: photo.alt_description || 'Wallpaper',
        });
      }
    }

    return wallpapers;
  } catch (error) {
    console.error('Error fetching liked wallpapers:', error);
    return [];
  }
}

interface MonsterAPIStatusResponse {
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'IN_QUEUE';
  result?: {
    output: string[];
  };
  process_id?: string;
}

interface MonsterAPIGenerateResponse {
  status: string;
  process_id: string;
}

export async function getAIGenratedWallpaper(query = 'nature'): Promise<WallpaperTypes> {
  try {
    const result = await generateImage(query, true);
    
    if (!result) {
      console.error('Error generating AI wallpaper');
      return {
        id: '',
        imageuri: '',
        title: query,
      }
    }

    if (result.status === 'FAILED') {
      console.error('AI wallpaper generation failed');
      return {
        id: '',
        imageuri: '',
        title: query,
      }
    }

    if (result.result?.output?.length === 0) {
      console.error('AI wallpaper generation failed');
      return {
        id: '',
        imageuri: '',
        title: query,
      }
    }

    return {
      id: result.process_id || '',
      imageuri: result.result?.output?.[0] || '',
      title: query,
    }
  } catch (error) {
    console.error('Error generating AI wallpaper:', error);
    return {
      id: '',
      imageuri: '',
      title: query,
    }
  }
}

async function checkImageStatus(processId: string): Promise<MonsterAPIStatusResponse | null> {
  try {
    const response = await fetch(
      `https://api.monsterapi.ai/v1/status/${processId}`,
      {
        headers: {
          authorization: MONSTER_API_KEY || '',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Error checking status:', response);
      return null;
    }

    const data = await response.json();
    return data as MonsterAPIStatusResponse;
  } catch (error) {
    console.error("Error checking status:", error);
    return null;
  }
}

async function generateImage(
  prompt = "beautiful landscape",
  safeFilter = false
): Promise<MonsterAPIStatusResponse | null> {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: MONSTER_API_KEY || '',
    },
    body: JSON.stringify({
      prompt: prompt,
      safe_filter: safeFilter,
      samples: 1,
    }),
  };

  try {
    const response = await fetch(
      "https://api.monsterapi.ai/v1/generate/txt2img",
      options
    );
    
    if (!response.ok) {
      console.error('Error generating image:', response);
      return null;
    }
    
    const data = await response.json() as MonsterAPIGenerateResponse;
    
    // Poll for result with timeout
    const processId = data.process_id;
    let result: MonsterAPIStatusResponse | null = null;
    let attempts = 0;
    const maxAttempts = 20; // 1 minute timeout (20 * 3 seconds)

    while (!result || ['IN_PROGRESS', 'IN_QUEUE'].includes(result.status)) {
      console.log('Checking status');
      
      result = await checkImageStatus(processId);
      if (!result) break;

      if (attempts >= maxAttempts) {
        console.error('Timeout generating image');
        return null;
      }

      if (['IN_PROGRESS', 'IN_QUEUE'].includes(result.status)) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        attempts++;
      }
    }

    return result;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}