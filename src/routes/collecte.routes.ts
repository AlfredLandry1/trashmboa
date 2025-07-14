import { Router } from 'express';
import * as collecteController from '../controllers/collecte.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Routes protégées (collecteur uniquement)
router.get('/en-attente', authenticate, authorize(['COLLECTOR']), collecteController.getCollectesAFaire);
router.put('/:id/valider', authenticate, authorize(['COLLECTOR']), collecteController.validerCollecte);
router.get('/', authenticate, collecteController.getAllCollectes);

export default router; 