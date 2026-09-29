import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { validate } from '../middlewares/validation.middleware';
import { createTaskSchema } from '../validations/task.schema';

const router = Router();

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/my-tasks', taskController.getUserTasks);

export default router;