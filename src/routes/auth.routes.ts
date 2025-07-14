import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authenticate as any, authController.logout);
router.post('/refresh', (req, res) => {
  authController.refresh(req, res);
});

export default router;
