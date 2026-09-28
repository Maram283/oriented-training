import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { taskController } from '../controllers/task.controller';

const router = Router();

// /api/admin/users
router.get('/users', userController.getAllUsers);

// /api/admin/tasks
router.get('/tasks', taskController.getAllTasks);

export default router;
