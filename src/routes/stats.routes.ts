import { Router } from 'express';
import * as statsController from '../controllers/stats.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Routes protégées (admin uniquement)
router.get('/dashboard', authenticate, authorize(['ADMIN']), statsController.getDashboardStats);
router.get('/dechets', authenticate, authorize(['ADMIN']), statsController.getDechetsStats);
router.get('/signalements', authenticate, authorize(['ADMIN']), statsController.getSignalementsStats);

export default router; 