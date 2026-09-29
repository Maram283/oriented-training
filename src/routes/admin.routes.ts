import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { taskController } from '../controllers/task.controller';

const router = Router();

router.get('/users', userController.getAllUsers);
router.get('/tasks', taskController.getAllTasks);

export default router;
