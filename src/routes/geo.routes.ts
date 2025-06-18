import { Router } from 'express';
import * as geoController from '../controllers/geo.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Route protégée (tous les utilisateurs authentifiés)
router.get('/proximite', authenticate, geoController.getProximite);

export default router;