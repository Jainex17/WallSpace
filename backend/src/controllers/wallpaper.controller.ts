import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const ACCESS_KEY1 = process.env.UNSPLASH_ACCESS_KEY1;
const MONSTER_API_KEY = process.env.MONSTER_API_KEY;

export const getCarouselWallpapers = (req: Request, res: Response) => {
  const wallpapers = [
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
  res.json(wallpapers);
};

export const getExploreWallpapers = async (req: Request, res: Response) => {
  const { query = "mobile wallpaper", count = 20 } = req.query;
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }
    
    const data = await response.json();
    
    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return res.status(500).json({ error: "Invalid response format" });
    }

    const wallpapers = data.map((photo: any) => ({
      id: photo.id,
      imageuri: photo.urls.regular,
      title: photo.alt_description || "Wallpaper",
      blur_hash: photo.blur_hash,
      color: photo.color,
    }));
    res.json(wallpapers);
  } catch (error) {
    console.error('Explore wallpapers error:', error);
    res.status(500).json({ error: "Failed to fetch wallpapers" });
  }
};

export const getSuggestedWallpapers = async (req: Request, res: Response) => {
  const { query = "nature", count = 20 } = req.query;
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY1}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }
    
    const data = await response.json();
    
    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return res.status(500).json({ error: "Invalid response format" });
    }

    const wallpapers = data.map((photo: any) => ({
      id: photo.id,
      imageuri: photo.urls.regular,
      title: photo.alt_description || "Wallpaper",
      blur_hash: photo.blur_hash,
      color: photo.color,
    }));
    res.json(wallpapers);
  } catch (error) {
    console.error('Suggested wallpapers error:', error);
    res.status(500).json({ error: "Failed to fetch suggested wallpapers" });
  }
};

interface MonsterAPIGenerateResponse {
  message: string;
  process_id: string;
  status_url: string;
  callback_url: string;
  webhook_url: string;
}

interface MonsterAPIStatusResponse {
  status: string;
  process_id: string;
  result?: {
    output: string[];
  };
}

export const generateAIWallpaper = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: MONSTER_API_KEY || "",
      },
      body: JSON.stringify({
        prompt: `A high-resolution, visually stunning mobile wallpaper of ${prompt}, with vibrant colors, balanced contrast, and a captivating composition. Designed for perfect mobile fit with artistic and cinematic appeal.`,
        safe_filter: true,
        samples: 1,
      }),
    };

    const response = await fetch(
      "https://api.monsterapi.ai/v1/generate/txt2img",
      options
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Error generating AI wallpaper" });
    }

    const data = await response.json() as MonsterAPIGenerateResponse;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate AI wallpaper" });
  }
};

export const checkAIWallpaperStatus = async (req: Request, res: Response) => {
  const { process_id } = req.body;

  if (!process_id) {
    return res.status(400).json({ error: "Process ID is required" });
  }

  try {
    const response = await fetch(
      `https://api.monsterapi.ai/v1/status/${process_id}`,
      {
        headers: {
          authorization: MONSTER_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Error checking wallpaper status" });
    }

    const data = await response.json() as MonsterAPIStatusResponse;

    if (data.status === "FAILED") {
      return res.status(400).json({ error: "Wallpaper generation failed" });
    }

    res.json({
      status: data.status,
      imageUrl: data.result?.output?.[0] || null,
      process_id: data.process_id
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check wallpaper status" });
  }
};
export const getWallpaperById = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid IDs" });
  }

  try {
    const wallpapers = [];
    
    for(let i = 0; i < ids.length; i++) {
      const response = await fetch(
        `https://api.unsplash.com/photos/${ids[i]}`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch wallpaper with ID: ${ids[i]}`);
        continue;
      }

      const photo = await response.json();
      wallpapers.push({
        id: photo.id,
        imageuri: photo.urls.regular,
        title: photo.alt_description || "Wallpaper",
        blur_hash: photo.blur_hash,
        color: photo.color,
      });
    }

    res.json(wallpapers);
  } catch (error) {
    console.error('Get wallpaper by ID error:', error);
    res.status(500).json({ error: "Failed to fetch wallpapers" });
  }
}
