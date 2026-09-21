import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validateInput } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validations/auth.schema';

const router = Router();

router.post('/register', validateInput(registerSchema), register);

router.post('/login', validateInput(loginSchema), login);

export default router;