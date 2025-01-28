import React from 'react';
import { useWallpaper } from '@/context/WallpaperContext';
import BottomPanel from './BottomPanel';

export function PageBottomPanel() {
  const { selectedWallpaper, setSelectedWallpaper } = useWallpaper();

  if (!selectedWallpaper) return null;

  return (
    <BottomPanel
      selectedWallpaper={selectedWallpaper}
      onClose={() => setSelectedWallpaper(null)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    />
  );
}
