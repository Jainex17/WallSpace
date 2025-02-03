import AsyncStorage from "@react-native-async-storage/async-storage";

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

export function getCarouselWallPapers(): WallpaperTypes[] {
  return [
    {
      id: "1",
      imageuri:
        "https://wallpapers.com/images/high/creepy-aesthetic-nrmstbq1d710rbnv.webp",
      title: "realm of dark",
    },
    {
      id: "2",
      imageuri:
        "https://wallpapers.com/images/high/creepy-aesthetic-njt3bncykm1kow9c.webp",
      title: "Explore the secrets",
    },
    {
      id: "3",
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-oddefnpota4nnr64.webp",
      title: "Aesthetic Girl",
    },
    {
      id: "4",
      imageuri:
        "https://wallpapers.com/images/high/calm-anime-man-holding-sword-az7md4eyd2fh53lg.webp",
      title: "Man Holding Sword",
    },
  ];
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
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.map((photo: any) => ({
          id: photo.id,
          imageuri: photo.urls.regular,
          title: photo.alt_description || 'Wallpaper',
      }));
  } catch (error) {
      console.error('Error fetching wallpapers:', error);
      return [];
  }
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
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.map((photo: any) => ({
          id: photo.id,
          imageuri: photo.urls.regular,
          title: photo.alt_description || 'Wallpaper',
      }));
  } catch (error) {
      console.error('Error fetching wallpapers:', error);
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
      throw new Error('Generation failed - no response');
    }

    if (result.status === 'FAILED') {
      throw new Error('Generation failed - server error');
    }

    if (result.result?.output?.length === 0) {
      throw new Error('No images generated');
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
      throw new Error("Network response was not ok");
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
      throw new Error("Network response was not ok");
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
        throw new Error('Generation timeout');
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