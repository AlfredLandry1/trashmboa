import { Router } from 'express';
import * as collecteController from '../controllers/collecte.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Routes protégées (collecteur uniquement)
router.get('/a-faire', authenticate, authorize(['COLLECTOR']), collecteController.getCollectesAFaire);
router.post('/:id/valider', authenticate, authorize(['COLLECTOR']), collecteController.validerCollecte);

export default router; 