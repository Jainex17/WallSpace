import { Router } from 'express';
import wallpaperRoutes from '../routes/wallpaper.routes';

const router = Router();

router.use('/wallpapers', wallpaperRoutes);
// Add more routes here as needed

export default router;
