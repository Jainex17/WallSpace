import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WallpaperTypes {
  imageuri: string;
  title: string;
  id: string;
}

const ACCESS_KEY = 'E26GBCuswAtWEn-amZJ_h_yJI_xRRld5ICryr8p1DVw'; // not mine :)
const ACCESS_KEY1 = 'wefY-JAWTnZUoVNcKJscWENryeTi7CSYuOU16G1fH4w'; // not mine :)

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

export async function getSuggestedWallPapers(query = 'nature', count = 10): Promise<WallpaperTypes[]> {
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