import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', verifyToken, taskRoutes);
router.use('/users', verifyToken, userRoutes);
router.use('/admin', verifyToken, authorizeAdmin, adminRoutes);

export default router;