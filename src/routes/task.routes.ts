import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createTaskSchema } from '../validations/task.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first task
 *               description:
 *                 type: string
 *                 example: This is a description
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /api/tasks/my-tasks:
 *   get:
 *     summary: Get all tasks for the logged in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/my-tasks', taskController.getUserTasks);

export default router;