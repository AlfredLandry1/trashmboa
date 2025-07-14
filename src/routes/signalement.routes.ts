import { Router } from 'express';
import * as signalementController from '../controllers/signalement.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, signalementController.createSignalement);
router.get('/', authenticate, signalementController.getAllSignalements);
router.get('/:id', authenticate, signalementController.getSignalementById);
router.put('/:id', authenticate, signalementController.updateSignalement);
router.delete('/:id', authenticate, signalementController.deleteSignalement);

export default router; 