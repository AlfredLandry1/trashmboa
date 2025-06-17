// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Routes publiques
router.post('/', userController.create);

// Routes protégées
router.get('/', authenticate, authorize(['ADMIN']), userController.getAll);
router.get('/:id', authenticate, userController.getById);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), userController.remove);

export default router;
