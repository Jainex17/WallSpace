const PEXELS_API_KEY = 'KEY'

async function getWallpapers(query = 'mobile wallpaper', count = 5) {
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=${count}`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large2x,
            thumb: photo.src.medium,
            description: photo.alt,
            photographer: photo.photographer
        }));
    } catch (error) {
        console.error('Error fetching wallpapers:', error);
        return [];
    }
}

// Example usage
getWallpapers().then(wallpapers => {
    wallpapers.forEach(wallpaper => {
        console.log(`Photo by ${wallpaper.photographer}: ${wallpaper.url}`);
    });
});
