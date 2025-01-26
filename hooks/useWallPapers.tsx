export interface WallpaperTypes {
  imageuri: string;
  title: string;
  id: number;
}

export default function Wallpapers(): WallpaperTypes[] {
  const wallpapersarr = [
    {
      id: 1,
      imageuri:
        "https://wallpapers.com/images/high/creepy-aesthetic-nrmstbq1d710rbnv.webp",
      title: "realm of dark",
    },
    {
      id: 2,
      imageuri:
        "https://wallpapers.com/images/high/creepy-aesthetic-njt3bncykm1kow9c.webp",
      title: "Explore the secrets",
    },
    {
      id: 3,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-oddefnpota4nnr64.webp",
      title: "Aesthetic Girl",
    },
    {
      id: 4,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-smd7qs98milsaulj.webp",
      title: "Seen Over The Beach",
    },
    {
      id: 5,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-lk3v18ni4gpnypxe.webp",
      title: "Over The Mountain",
    },
    {
      id: 6,
      imageuri:
        "https://wallpapers.com/images/high/calm-anime-man-holding-sword-az7md4eyd2fh53lg.webp",
      title: "Man Holding Sword",
    },
    {
      id: 7,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-oddefnpota4nnr64.webp",
      title: "Aesthetic Girl",
    },
    {
      id: 8,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-smd7qs98milsaulj.webp",
      title: "Seen Over The Beach",
    },
    {
      id: 9,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-lk3v18ni4gpnypxe.webp",
      title: "Over The Mountain",
    },
    {
      id: 10,
      imageuri:
        "https://wallpapers.com/images/high/calm-anime-man-holding-sword-az7md4eyd2fh53lg.webp",
      title: "Man Holding Sword",
    },
  ];

  return wallpapersarr.sort(() => Math.random() - 0.5);
}

export function getCarouselWallPapers(): WallpaperTypes[] {
  return [
    {
      id: 1,
      imageuri:
        "https://wallpapers.com/images/high/creepy-aesthetic-nrmstbq1d710rbnv.webp",
      title: "realm of dark",
    },
    {
      id: 2,
      imageuri:
        "https://wallpapers.com/images/high/creepy-aesthetic-njt3bncykm1kow9c.webp",
      title: "Explore the secrets",
    },
    {
      id: 3,
      imageuri:
        "https://wallpapers.com/images/high/aesthetic-star-laptop-oddefnpota4nnr64.webp",
      title: "Aesthetic Girl",
    },
    {
      id: 4,
      imageuri:
        "https://wallpapers.com/images/high/calm-anime-man-holding-sword-az7md4eyd2fh53lg.webp",
      title: "Man Holding Sword",
    },
  ];
}