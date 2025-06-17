import { Router } from 'express';
import * as historiqueController from '../controllers/historique.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Route protégée (tous les utilisateurs authentifiés)
router.get('/', authenticate, historiqueController.getHistorique);

export default router; 