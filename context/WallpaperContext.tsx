import { createContext, useContext, useState } from 'react';
import { WallpaperTypes } from '@/hooks/useWallPapers';

type WallpaperContextType = {
  selectedWallpaper: WallpaperTypes | null;
  setSelectedWallpaper: (wallpaper: WallpaperTypes | null) => void;
};

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperTypes | null>(null);

  return (
    <WallpaperContext.Provider value={{ selectedWallpaper, setSelectedWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
}
