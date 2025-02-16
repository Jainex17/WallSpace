import { Router } from 'express';
import {
  getCarouselWallpapers,
  getExploreWallpapers,
  getSuggestedWallpapers,
  generateAIWallpaper,
  checkAIWallpaperStatus
} from '../controllers/wallpaper.controller';

const router = Router();

router.get('/carousel', getCarouselWallpapers);
router.get('/explore', getExploreWallpapers);
router.get('/suggested', getSuggestedWallpapers);
router.post('/generate', generateAIWallpaper); // req.body = { prompt: "" }
router.post('/status', checkAIWallpaperStatus); // req.body = { process_id: "" }

export default router;
