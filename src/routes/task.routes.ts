import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { verifyToken } from '../middlewares/auth.middleware';
const router = Router();

router.post('/', verifyToken, TaskController.createTask);
router.get('/', verifyToken, TaskController.getAllTasks);
router.get('/my-tasks', verifyToken, TaskController.getUserTasks);

export default router;