import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { validateInput } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validations/auth.schema';
import { verifyToken, authorize } from '../middlewares/auth.middleware';
import taskRoutes from './task.routes';

const router = Router();
router.use('/tasks', taskRoutes);

if (register && validateInput && registerSchema) {
  router.post('/register', validateInput(registerSchema), register);
}

if (login && validateInput && loginSchema) {
  router.post('/login', validateInput(loginSchema), login);
}

if (getUserById) {
  router.get('/users/:id', getUserById);
}

if (getAllUsers && verifyToken && authorize) {
  router.get('/users', verifyToken, authorize(['admin']), getAllUsers);
}

export default router;