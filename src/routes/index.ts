import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validateLoginInput } from '../middlewares/auth.middleware';

const router = Router();

// نضع الـ Middleware قبل الـ Controller مباشرة
router.post('/login', validateLoginInput, login);

export default router;