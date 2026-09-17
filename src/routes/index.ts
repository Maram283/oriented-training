import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validateInput } from '../middlewares/auth.middleware';
import { loginSchema, registerSchema } from '../middlewares/auth.schema';

const router = Router();

// مسار التسجيل الجديد
router.post('/register', validateInput(registerSchema), register);

// مسار تسجيل الدخول
router.post('/login', validateInput(loginSchema), login);

export default router;