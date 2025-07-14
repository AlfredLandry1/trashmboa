import { Router } from 'express';
import * as dechetController from '../controllers/dechet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, dechetController.getAll);
router.get('/:id', authenticate, dechetController.getById);
router.post('/', authenticate, dechetController.createDechet);
router.put('/:id', authenticate, dechetController.update);
router.delete('/:id', authenticate, dechetController.remove);

export default router; 