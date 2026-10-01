import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { verifyToken } from '../middlewares/auth.middleware';
import { loginSchema, registerSchema, verify2FALoginSchema, verify2FASetupSchema } from '../validations/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/login/verify-2fa', validate(verify2FALoginSchema), authController.verify2FALogin);

router.post('/2fa/generate', verifyToken, authController.generate2FA);
router.post('/2fa/verify', verifyToken, validate(verify2FASetupSchema), authController.verify2FASetup);

export default router;